import { describe, it, expect } from "vitest";

describe("Stripe Price ID configuration", () => {
  it("STRIPE_PRICE_ID should be set and have correct format", () => {
    const priceId = process.env.STRIPE_PRICE_ID ?? "";
    expect(priceId).toBeTruthy();
    // Stripe price IDs start with 'price_'
    expect(priceId).toMatch(/^price_/);
  });

  it("STRIPE_SECRET_KEY should be set", () => {
    const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
    expect(secretKey).toBeTruthy();
    // Test mode keys start with sk_test_, live keys with sk_live_
    expect(secretKey).toMatch(/^sk_(test|live)_/);
  });
});
