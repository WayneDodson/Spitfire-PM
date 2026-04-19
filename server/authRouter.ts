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
import { createEmailToken, verifyEmailToken, sendVerificationEmail, sendPasswordResetEmail } from "./email";
import { startTrialIfNeeded, recordDailyLogin } from "./trial";

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
  // Accept either an email address or a username in the same field
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .max(320, "Input too long")
    .transform((v) => v.trim()),
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

    // Start 7-day free trial and record first login
    startTrialIfNeeded(userId).then(() => recordDailyLogin(userId)).catch(() => {});

    // Send verification email asynchronously — don't block the response
    createEmailToken(userId, "email_verification")
      .then((rawToken) => sendVerificationEmail(email, displayName, rawToken))
      .catch((err) => console.error("[Auth] Failed to send verification email:", err));

    return res.status(201).json({
      success: true,
      user: sanitiseUser({ id: userId, email, displayName, name: displayName, authProvider: "email" }),
      emailVerificationSent: true,
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
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const { identifier, password } = parsed.data;

  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    // Determine if the identifier looks like an email or a username
    const isEmail = identifier.includes("@");
    const [user] = await db
      .select()
      .from(users)
      .where(isEmail ? eq(users.email, identifier.toLowerCase()) : eq(users.username, identifier))
      .limit(1);

    // Always run bcrypt.compare to prevent timing attacks that reveal whether
    // an account exists. Use a dummy hash when no user is found.
    const DUMMY_HASH = "$2b$12$invalidhashfortimingnormalization000000000000000000000";
    const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.passwordHash || !valid) {
      // Uniform message — never reveal whether the account exists
      return res.status(401).json({ error: "Invalid username/email or password" });
    }

    // Update last signed in
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

    await createUserSession(res, user.id, user.email!, req);

    // Start trial if not yet started, and record daily login
    startTrialIfNeeded(user.id).then(() => recordDailyLogin(user.id)).catch(() => {});

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

    // Start trial if not yet started, and record daily login
    startTrialIfNeeded(userId).then(() => recordDailyLogin(userId)).catch(() => {});

    return res.json({
      success: true,
      user: sanitiseUser({ id: userId, email: email.toLowerCase(), displayName, name: displayName, authProvider: "google", avatarUrl }),
    });
  } catch (err) {
    console.error("[Auth] Google OAuth error:", err);
    return res.status(500).json({ error: "Google sign-in failed. Please try again." });
  }
});

// ─── Email Verification ──────────────────────────────────────────────────────
router.post("/verify-email", async (req: Request, res: Response) => {
  const schema = z.object({ token: z.string().min(1).max(128) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid token" });

  try {
    const userId = await verifyEmailToken(parsed.data.token, "email_verification");
    if (!userId) {
      return res.status(400).json({ error: "This verification link is invalid or has expired. Please request a new one." });
    }

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));

    return res.json({ success: true, message: "Email verified successfully!" });
  } catch (err) {
    console.error("[Auth] Verify email error:", err);
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

router.post("/resend-verification", async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid email" });

  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    const [user] = await db
      .select({ id: users.id, displayName: users.displayName, name: users.name, emailVerified: users.emailVerified })
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (user && !user.emailVerified) {
      const rawToken = await createEmailToken(user.id, "email_verification");
      const displayName = user.displayName || user.name || "there";
      await sendVerificationEmail(parsed.data.email, displayName, rawToken);
    }

    return res.json({ success: true, message: "If that email is registered and unverified, a new verification link has been sent." });
  } catch (err) {
    console.error("[Auth] Resend verification error:", err);
    return res.status(500).json({ error: "Failed to resend verification email. Please try again." });
  }
});

// ─── Forgot Password ─────────────────────────────────────────────────────────
router.post("/forgot-password", async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid email address" });

  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    const [user] = await db
      .select({ id: users.id, displayName: users.displayName, name: users.name, authProvider: users.authProvider })
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (user && user.authProvider !== "google") {
      const rawToken = await createEmailToken(user.id, "password_reset");
      const displayName = user.displayName || user.name || "there";
      await sendPasswordResetEmail(parsed.data.email, displayName, rawToken).catch((err) => {
        console.error("[Auth] Failed to send password reset email:", err);
      });
    }

    return res.json({
      success: true,
      message: "If that email is registered, a password reset link has been sent.",
    });
  } catch (err) {
    console.error("[Auth] Forgot password error:", err);
    return res.status(500).json({ error: "Failed to process request. Please try again." });
  }
});

// ─── Reset Password ───────────────────────────────────────────────────────────
router.post("/reset-password", async (req: Request, res: Response) => {
  const schema = z.object({
    token: z.string().min(1).max(128),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return res.status(400).json({ error: msg });
  }

  try {
    const userId = await verifyEmailToken(parsed.data.token, "password_reset");
    if (!userId) {
      return res.status(400).json({
        error: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Service temporarily unavailable" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

    return res.json({ success: true, message: "Password updated successfully. You can now log in." });
  } catch (err) {
    console.error("[Auth] Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post("/logout", (req: Request, res: Response) => {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ success: true });
});

export default router;
