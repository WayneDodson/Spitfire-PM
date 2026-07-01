import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import authRouter from "../authRouter";
import { handleStripeWebhook } from "../routers/stripe";
import { coachingRemindersHandler } from "../scheduledHandlers/coachingReminders";
import { handleCoachingIcsDownload } from "../coachingCalendar";
import { appRouter } from "../routers";
import { createContext } from "./context";
// Vite and static serving are loaded dynamically below (keeps Vite out of production bundle)
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import crypto from "crypto";
import fs from "fs";
import path from "path";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── Trust proxy (required for accurate IP-based rate limiting) ─────────────
  app.set("trust proxy", 1);

  // ─── Request ID for traceability ────────────────────────────────────────────
  app.use((_req, res, next) => {
    res.setHeader("X-Request-ID", crypto.randomUUID());
    next();
  });

  // ─── Security headers via Helmet ────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // 'unsafe-eval' removed — eliminates a major XSS vector
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Required for Vite HMR in dev; acceptable for SPA
            "https://js.stripe.com",
            "https://accounts.google.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://accounts.google.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: [
            "'self'",
            "https://api.manus.im",
            "https://*.manus.computer",
            "wss:",
            "https://accounts.google.com",
          ],
          // Allow Stripe iframes for payment elements
          frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
          // Prevent this site from being embedded in iframes (clickjacking)
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      // HSTS: 1 year with preload
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })
  );

  // ─── Permissions Policy (disable unused browser features) ───────────────────
  app.use((_req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(self), geolocation=(), usb=(), interest-cohort=()"
    );
    next();
  });

  // ─── HTTP Parameter Pollution protection ────────────────────────────────────
  app.use(hpp());

  // ─── Rate limiters ──────────────────────────────────────────────────────────
  // General API: 200 requests per 15 minutes
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
    skip: (req) => req.path === "/api/health",
  });

  // Auth login/Google: 50 attempts per 15 minutes per IP (brute-force protection)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many authentication attempts. Please wait 15 minutes before trying again." },
  });

  // Registration: 5 per hour per IP (prevents mass account creation)
  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many registration attempts. Please try again in an hour." },
  });

  app.use("/api/trpc", generalLimiter);
  app.use("/api/oauth", authLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/google", authLimiter);
  app.use("/api/auth/register", registerLimiter);

  // ─── Stripe webhook — raw body BEFORE body parser ───────────────────────────
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    (req as any).rawBody = req.body;
    handleStripeWebhook(req, res);
  });

  // ─── Scheduled: coaching reminders (24h + 1h before sessions) ───────────────
  app.post("/api/scheduled/coaching-reminders", coachingRemindersHandler);

  // ─── Body parser — tight limits to prevent DoS ──────────────────────────────
  // Auth endpoints: 100 KB (email + password + name is tiny)
  app.use("/api/auth", express.json({ limit: "100kb" }));
  app.use("/api/auth", express.urlencoded({ limit: "100kb", extended: false }));
  // General API: 1 MB
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ limit: "1mb", extended: false }));

  // ─── Custom auth routes ──────────────────────────────────────────────────────
  app.use("/api/auth", authRouter);

  // ─── Storage proxy ──────────────────────────────────────────────────────────
  registerStorageProxy(app);

  // ─── Legacy Manus OAuth callback ────────────────────────────────────────────
  registerOAuthRoutes(app);

  // ─── tRPC API ────────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── Coaching ICS calendar download ────────────────────────────────────────
  app.get("/api/coaching/calendar/:bookingId.ics", handleCoachingIcsDownload);

  // ─── Health check (unauthenticated, excluded from rate limiting) ─────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // ─── Frontend ────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    // Dynamic import keeps Vite entirely out of the production bundle
    const { setupVite } = await import("./vite.js");
    await setupVite(app, server);
  } else {
    // Inline static server — no Vite dependency in production
    const distPath = path.resolve(import.meta.dirname, "public");
    if (!fs.existsSync(distPath)) {
      console.error(`[static] Build directory not found: ${distPath}`);
    } else {
      console.log(`[static] Serving from: ${distPath}`);
    }
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
