/**
 * Stripe product and price definitions.
 * All Stripe IDs are read from environment variables set by the platform.
 *
 * Plan: Spitfire PM Pro — £19.99/month, cancel anytime, no refunds.
 */

export const PLANS = {
  pro: {
    name: "Spitfire PM Pro",
    description: "Full access to all 7 levels, 100+ simulations, and interview prep.",
    priceGbp: 19.99,
    interval: "month" as const,
    /** STRIPE_PRICE_ID is injected by the platform from the provisioned Stripe sandbox */
    stripePriceId: process.env.STRIPE_PRICE_ID!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
