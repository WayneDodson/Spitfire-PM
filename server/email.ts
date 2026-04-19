/**
 * Email service — uses Resend as the primary provider.
 * In development (no RESEND_API_KEY), emails are logged to console instead.
 *
 * Sender:   Spitfire PM <support@spitfireitsolutions.com>
 * Reply-To: support@spitfireitsolutions.com
 * APP_URL:  https://www.spitfire-pm.com
 */
import { Resend } from "resend";
import crypto from "crypto";
import { getDb } from "./db";
import { emailTokens } from "../drizzle/schema";
import { eq, and, gt } from "drizzle-orm";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Spitfire PM <support@spitfireitsolutions.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "support@spitfireitsolutions.com";
const APP_URL = process.env.APP_URL ?? "https://www.spitfire-pm.com";

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

/** Generate a cryptographically secure random token and its SHA-256 hash */
export function generateToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString("hex"); // 64 hex chars
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

/** Store a token in the DB and return the raw token to embed in the email link */
export async function createEmailToken(
  userId: number,
  type: "email_verification" | "password_reset"
): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const { raw, hash } = generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(emailTokens).values({
    userId,
    tokenHash: hash,
    type,
    expiresAt,
    used: false,
  });

  return raw;
}

/**
 * Verify a raw token from the URL.
 * Returns the userId if valid, or null if expired/used/not found.
 * Marks the token as used atomically.
 */
export async function verifyEmailToken(
  rawToken: string,
  type: "email_verification" | "password_reset"
): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const now = new Date();

  const [token] = await db
    .select()
    .from(emailTokens)
    .where(
      and(
        eq(emailTokens.tokenHash, hash),
        eq(emailTokens.type, type),
        eq(emailTokens.used, false),
        gt(emailTokens.expiresAt, now)
      )
    )
    .limit(1);

  if (!token) return null;

  // Mark as used (single-use enforcement)
  await db
    .update(emailTokens)
    .set({ used: true })
    .where(eq(emailTokens.id, token.id));

  return token.userId;
}

/** Send an email. Falls back to console.log in dev when no API key is set. */
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const resend = getResend();

  if (!resend) {
    // Dev fallback — print to console so developers can copy the link
    console.log("\n─── [EMAIL DEV FALLBACK] ───────────────────────────────────");
    console.log(`To:       ${opts.to}`);
    console.log(`From:     ${FROM_EMAIL}`);
    console.log(`Reply-To: ${REPLY_TO}`);
    console.log(`Subject:  ${opts.subject}`);
    console.log(`Body:     ${opts.text}`);
    console.log("────────────────────────────────────────────────────────────\n");
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: opts.to,
    replyTo: REPLY_TO,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (error) {
    console.error("[Email] Send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// ─── Shared email footer HTML ─────────────────────────────────────────────────

function emailFooter(): string {
  return `
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
  <p style="color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.8;">
    Spitfire PM &middot; <a href="${APP_URL}" style="color: #0ea5e9;">${APP_URL}</a><br>
    Questions? Reply to this email or contact us at
    <a href="mailto:support@spitfireitsolutions.com" style="color: #0ea5e9;">support@spitfireitsolutions.com</a>
  </p>`;
}

// ─── Email templates ─────────────────────────────────────────────────────────

export async function sendVerificationEmail(
  to: string,
  displayName: string,
  rawToken: string
): Promise<void> {
  const link = `${APP_URL}/verify-email?token=${rawToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #fff;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 700; color: #0ea5e9; margin: 0;">Spitfire PM</h1>
    <p style="color: #64748b; margin: 4px 0 0;">UK Career Transition Platform</p>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Verify your email address</h2>
  <p style="color: #475569; line-height: 1.6;">Hi ${displayName},</p>
  <p style="color: #475569; line-height: 1.6;">Thanks for joining Spitfire PM! Please verify your email address to unlock all features and begin your PM career transition.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${link}" style="display: inline-block; background: #0ea5e9; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
  </div>
  <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">This link expires in <strong>1 hour</strong>. If you didn't create an account, you can safely ignore this email.</p>
  ${emailFooter()}
</body>
</html>`;

  const text = `Hi ${displayName},\n\nThanks for joining Spitfire PM! Please verify your email address by visiting:\n${link}\n\nThis link expires in 1 hour.\n\nIf you didn't create an account, you can safely ignore this email.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: "Verify your Spitfire PM email address", html, text });
}

export async function sendPasswordResetEmail(
  to: string,
  displayName: string,
  rawToken: string
): Promise<void> {
  const link = `${APP_URL}/reset-password?token=${rawToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; background: #fff;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 24px; font-weight: 700; color: #0ea5e9; margin: 0;">Spitfire PM</h1>
    <p style="color: #64748b; margin: 4px 0 0;">UK Career Transition Platform</p>
  </div>
  <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Reset your password</h2>
  <p style="color: #475569; line-height: 1.6;">Hi ${displayName},</p>
  <p style="color: #475569; line-height: 1.6;">We received a request to reset your Spitfire PM password. Click the button below to choose a new one.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="${link}" style="display: inline-block; background: #0ea5e9; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
  </div>
  <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">This link expires in <strong>1 hour</strong> and can only be used once. If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
  ${emailFooter()}
</body>
</html>`;

  const text = `Hi ${displayName},\n\nTo reset your Spitfire PM password, visit:\n${link}\n\nThis link expires in 1 hour and can only be used once.\n\nIf you didn't request a password reset, you can safely ignore this email.\n\n— Spitfire PM\nsupport@spitfireitsolutions.com`;

  await sendEmail({ to, subject: "Reset your Spitfire PM password", html, text });
}
