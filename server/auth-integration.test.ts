import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";

/**
 * Integration tests for the authentication system.
 * These tests verify the auth routes and database connectivity.
 */
describe("Auth System Integration", () => {
  it("should connect to the database", async () => {
    const db = await getDb();
    expect(db).not.toBeNull();
  });

  it("should have COOKIE_NAME defined", async () => {
    const { COOKIE_NAME } = await import("../shared/const");
    expect(COOKIE_NAME).toBeTruthy();
    expect(typeof COOKIE_NAME).toBe("string");
  });

  it("should have JWT_SECRET configured", () => {
    const secret = process.env.JWT_SECRET ?? "";
    expect(secret).toBeTruthy();
    expect(secret.length).toBeGreaterThan(10);
  });

  it("should have GOOGLE_CLIENT_ID configured", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
    expect(clientId).toBeTruthy();
    expect(clientId).toMatch(/\.apps\.googleusercontent\.com$/);
  });
});

describe("Stripe Integration", () => {
  it("should have STRIPE_SECRET_KEY configured", () => {
    const key = process.env.STRIPE_SECRET_KEY ?? "";
    expect(key).toBeTruthy();
    expect(key).toMatch(/^sk_(test|live)_/);
  });

  it("should have STRIPE_PRICE_ID configured", () => {
    const priceId = process.env.STRIPE_PRICE_ID ?? "";
    expect(priceId).toBeTruthy();
    expect(priceId).toMatch(/^price_/);
  });

  it("should have STRIPE_WEBHOOK_SECRET configured", () => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
    expect(webhookSecret).toBeTruthy();
    // Webhook secrets start with whsec_
    expect(webhookSecret).toMatch(/^whsec_/);
  });
});

describe("Referral System", () => {
  it("should be able to import referral functions from db", async () => {
    const { getUserByReferralCode, createReferral, getReferralCount } = await import("./db");
    expect(typeof getUserByReferralCode).toBe("function");
    expect(typeof createReferral).toBe("function");
    expect(typeof getReferralCount).toBe("function");
  });

  it("should return undefined for non-existent referral code", async () => {
    const { getUserByReferralCode } = await import("./db");
    const result = await getUserByReferralCode("NONEXISTENT123");
    expect(result).toBeUndefined();
  });
});
