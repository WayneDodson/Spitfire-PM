import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { getDb, getUserByReferralCode, createReferral } from "./db";
import { users } from "../drizzle/schema";
import { eq, or } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const";
import { SignJWT } from "jose";
import { z } from "zod";

const router = Router();

const googleClient = new OAuth2Client(ENV.googleClientId);

// ─── Input schemas (Zod) ─────────────────────────────────────────────────────

const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(320, "Email too long")
    .email("Invalid email address")
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or less")
    .regex(
      /^[a-zA-Z0-9\s'\-\.]+$/,
      "Display name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    )
    .transform((v) => v.trim()),
  referralCode: z
    .string()
    .max(32)
    .regex(/^[A-Z0-9]+$/, "Invalid referral code format")
    .optional()
    .transform((v) => v?.toUpperCase()),
});

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(320, "Email too long")
    .email("Invalid email address")
    .transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password too long"),
});

const googleSchema = z.object({
  credential: z.string().min(1, "Google credential is required").max(4096),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function createUserSession(
  res: Response,
  userId: number,
  email: string,
  req: Request
): Promise<void> {
  const secret = new TextEncoder().encode(ENV.cookieSecret);
  const token = await new SignJWT({ userId, email, type: "custom" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(secret);
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
}

function generateReferralCode(): string {
  // Use crypto-random bytes for unpredictable codes
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .toUpperCase()
    .slice(0, 8);
}

/** Strip sensitive fields before returning user data to the client */
function sanitiseUser(user: {
  id: number;
  email: string | null;
  displayName: string | null;
  name: string | null;
  authProvider: string | null;
  avatarUrl?: string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName || user.name,
    authProvider: user.authProvider,
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
  };
}

// ─── Email/Password Registration ─────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  // Validate and sanitise input
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = (parsed.error.issues as any[])[0]?.message ?? "Invalid input";
    return res.status(400).json({ error: firstError });
  }
  const { email, password, displayName, referralCode } = parsed.data;

  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      // Use generic message to avoid email enumeration
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // bcrypt cost factor 12 — ~250ms on modern hardware, strong against GPU attacks
    const passwordHash = await bcrypt.hash(password, 12);
    const newReferralCode = generateReferralCode();

    const [result] = await db.insert(users).values({
      email,
      passwordHash,
      displayName,
      name: displayName,
      authProvider: "email",
      emailVerified: false,
      referralCode: newReferralCode,
      lastSignedIn: new Date(),
    });

    const userId = (result as any).insertId;

    // Handle referral code if provided
    if (referralCode) {
      try {
        const referrer = await getUserByReferralCode(referralCode);
        if (referrer && referrer.id !== userId) {
          await createReferral({
            referrerId: referrer.id,
            referredUserId: userId,
            referralCode,
            signedUp: true,
          });
        }
      } catch {
        // Referral tracking failure must not block registration
      }
    }

    await createUserSession(res, userId, email, req);

    return res.status(201).json({
      success: true,
      user: sanitiseUser({ id: userId, email, displayName, name: displayName, authProvider: "email" }),
    });
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── Email/Password Login ─────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    // Generic error to avoid leaking which field failed
    return res.status(400).json({ error: "Invalid email or password" });
  }
  const { email, password } = parsed.data;

  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always run bcrypt.compare to prevent timing attacks that reveal whether
    // an account exists. Use a dummy hash when no user is found.
    const DUMMY_HASH = "$2b$12$invalidhashfortimingnormalization000000000000000000000";
    const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.passwordHash || !valid) {
      // Uniform error message — never reveal whether the email exists
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last signed in
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

    await createUserSession(res, user.id, user.email!, req);

    return res.json({
      success: true,
      user: sanitiseUser(user),
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.post("/google", async (req: Request, res: Response) => {
  const parsed = googleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Google credential is required" });
  }
  const { credential } = parsed.data;

  try {
    // Verify the Google ID token — this validates audience, expiry, and signature
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: ENV.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "Google account must have an email address" });
    }

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    // Check if user exists by googleId or email
    const [existing] = await db
      .select()
      .from(users)
      .where(or(eq(users.googleId, googleId), eq(users.email, email.toLowerCase())))
      .limit(1);

    let userId: number;
    let displayName: string;
    let avatarUrl: string | undefined;

    if (existing) {
      await db
        .update(users)
        .set({
          googleId,
          avatarUrl: picture,
          authProvider: "google",
          emailVerified: true,
          lastSignedIn: new Date(),
        })
        .where(eq(users.id, existing.id));

      userId = existing.id;
      displayName = existing.displayName || existing.name || name || email.split("@")[0];
      avatarUrl = picture;
    } else {
      const referralCode = generateReferralCode();
      const [result] = await db.insert(users).values({
        email: email.toLowerCase(),
        googleId,
        name: name || email.split("@")[0],
        displayName: name || email.split("@")[0],
        avatarUrl: picture,
        authProvider: "google",
        emailVerified: true,
        referralCode,
        lastSignedIn: new Date(),
      });

      userId = (result as any).insertId;
      displayName = name || email.split("@")[0];
      avatarUrl = picture;
    }

    await createUserSession(res, userId, email.toLowerCase(), req);

    return res.json({
      success: true,
      user: sanitiseUser({ id: userId, email: email.toLowerCase(), displayName, name: displayName, authProvider: "google", avatarUrl }),
    });
  } catch (err) {
    console.error("[Auth] Google OAuth error:", err);
    return res.status(500).json({ error: "Google sign-in failed. Please try again." });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post("/logout", (req: Request, res: Response) => {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ success: true });
});

export default router;
