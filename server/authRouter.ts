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

const router = Router();

const googleClient = new OAuth2Client(ENV.googleClientId);

async function createUserSession(res: Response, userId: number, email: string, req: any): Promise<void> {
  const secret = new TextEncoder().encode(ENV.cookieSecret);
  const token = await new SignJWT({ userId, email, type: 'custom' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(secret);
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ─── Email/Password Registration ────────────────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, referralCode } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "Email, password, and display name are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    if (displayName.trim().length < 2 || displayName.trim().length > 50) {
      return res.status(400).json({ error: "Display name must be 2-50 characters" });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    // Check if email already exists
    const existing = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newReferralCode = generateReferralCode();

    const [result] = await db.insert(users).values({
      email: email.toLowerCase().trim(),
      passwordHash,
      displayName: displayName.trim(),
      name: displayName.trim(),
      authProvider: "email",
      emailVerified: false,
      referralCode: newReferralCode,
      lastSignedIn: new Date(),
    });

    const userId = (result as any).insertId;

    // Handle referral code if provided
    if (referralCode) {
      try {
        const referrer = await getUserByReferralCode(referralCode.toUpperCase());
        if (referrer && referrer.id !== userId) {
          await createReferral({
            referrerId: referrer.id,
            referredUserId: userId,
            referralCode: referralCode.toUpperCase(),
            signedUp: true,
          });
          console.log(`[Auth] Referral tracked: user ${userId} referred by ${referrer.id}`);
        }
      } catch (refErr) {
        console.error("[Auth] Referral tracking error:", refErr);
        // Don't fail registration if referral tracking fails
      }
    }

    await createUserSession(res, userId, email.toLowerCase().trim(), req);

    return res.json({
      success: true,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        displayName: displayName.trim(),
        authProvider: "email",
      },
    });
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─── Email/Password Login ────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await getDb();
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: "This account uses Google sign-in. Please use 'Sign in with Google'." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last signed in
    await db.update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    await createUserSession(res, user.id, user.email!, req);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.name,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── Google OAuth ────────────────────────────────────────────────────────────
router.post("/google", async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google credential is required" });
    }

    // Verify the Google ID token
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
    if (!db) return res.status(500).json({ error: "Database unavailable" });

    // Check if user exists by googleId or email
    const [existing] = await db.select()
      .from(users)
      .where(or(eq(users.googleId, googleId), eq(users.email, email)))
      .limit(1);

    let userId: number;
    let displayName: string;

    if (existing) {
      // Update existing user with Google info if needed
      await db.update(users)
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
    } else {
      // Create new user
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
    }

    await createUserSession(res, userId, email, req);

    return res.json({
      success: true,
      user: {
        id: userId,
        email,
        displayName,
        authProvider: "google",
        avatarUrl: picture,
      },
    });
  } catch (err) {
    console.error("[Auth] Google OAuth error:", err);
    return res.status(500).json({ error: "Google sign-in failed. Please try again." });
  }
});

// ─── Logout ──────────────────────────────────────────────────────────────────
router.post("/logout", (req: Request, res: Response) => {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return res.json({ success: true });
});

export default router;
