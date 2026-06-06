/**
 * PROTECTED_ADMIN_EMAILS
 * ─────────────────────────────────────────────────────────────────
 * Comma-separated list of emails that are ALWAYS admin.
 * These cannot be demoted — not by a bug, redeploy, or code change.
 * Set in your hosting environment as:
 *   PROTECTED_ADMIN_EMAILS=wayne_dodson@hotmail.com,jenny_sacay_herbert@outlook.com
 *
 * Never hardcode real emails here — this file is in a public repo.
 * ─────────────────────────────────────────────────────────────────
 */
const parseProtectedEmails = (): Set<string> => {
  const raw = process.env.PROTECTED_ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
};

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  // Parsed once at startup — a Set for O(1) lookups
  protectedAdminEmails: parseProtectedEmails(),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
};

// Also export as 'env' for convenience
export const env = ENV;
