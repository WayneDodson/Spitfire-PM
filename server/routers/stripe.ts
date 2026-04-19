import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { subscriptions, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { Request, Response } from "express";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// £20/month price - we'll create this product/price in Stripe
// The price ID will be set via environment variable
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) {
    console.warn("[Stripe] STRIPE_SECRET_KEY not configured");
    return null;
  }
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}

export const stripeRouter = router({
  // Create a Stripe Checkout session for the £20/month subscription
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const stripe = getStripe();
      if (!stripe) {
        throw new Error("Payment system is not configured. Please contact support.");
      }

      // Validate that redirect URLs are same-origin to prevent open redirect
      const requestOrigin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.headers.host}`;
      const successOrigin = new URL(input.successUrl).origin;
      const cancelOrigin = new URL(input.cancelUrl).origin;
      if (successOrigin !== requestOrigin || cancelOrigin !== requestOrigin) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Redirect URLs must be same-origin' });
      }

      if (!STRIPE_PRICE_ID) {
        throw new Error("Subscription price not configured. Please contact support.");
      }

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if user already has an active subscription
      const existing = await db
        .select()
        .from(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, ctx.user.id),
            eq(subscriptions.status, "active")
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error("You already have an active subscription.");
      }

      // Get or create Stripe customer
      let stripeCustomerId: string | undefined;

      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (existingSub[0]?.stripeCustomerId) {
        stripeCustomerId = existingSub[0].stripeCustomerId;
      } else {
        // Create new customer
        const customer = await stripe.customers.create({
          email: ctx.user.email ?? undefined,
          name: ctx.user.displayName || ctx.user.name || undefined,
          metadata: {
            userId: String(ctx.user.id),
          },
        });
        stripeCustomerId = customer.id;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          userId: String(ctx.user.id),
        },
        subscription_data: {
          metadata: {
            userId: String(ctx.user.id),
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
      });

      return { url: session.url };
    }),

  // Create a Stripe Customer Portal session for managing subscription
  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const stripe = getStripe();
      if (!stripe) throw new Error("Payment system not configured");

      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (!sub[0]?.stripeCustomerId) {
        throw new Error("No subscription found");
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: sub[0].stripeCustomerId,
        return_url: input.returnUrl,
      });

      return { url: session.url };
    }),

  // Get current subscription status
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { hasSubscription: false, subscription: null };

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!sub[0]) {
      return { hasSubscription: false, subscription: null };
    }

    return {
      hasSubscription: sub[0].status === "active",
      subscription: {
        status: sub[0].status,
        currentPeriodEnd: sub[0].currentPeriodEnd,
        cancelAtPeriodEnd: sub[0].cancelAtPeriodEnd,
      },
    };
  }),
});

/**
 * Handle Stripe webhook events.
 * Register this as a raw Express route (before body parser) in server/_core/index.ts
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: "Missing signature" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      (req as any).rawBody || req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const db = await getDb();
  if (!db) return res.status(500).json({ error: "Database unavailable" });

  // Required: handle Stripe test events (CLI test webhooks)
  if (event.id.startsWith('evt_test_')) {
    console.log('[Stripe Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = parseInt(session.metadata?.userId ?? "0");
        if (!userId) break;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Fetch full subscription details
        const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
        const subData = stripeSub as any;

        await db.insert(subscriptions).values({
          userId,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          status: "active",
          currentPeriodStart: subData.current_period_start ? new Date(subData.current_period_start * 1000) : null,
          currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
        }).onDuplicateKeyUpdate({
          set: {
            status: "active",
            stripeCustomerId: customerId,
            currentPeriodStart: subData.current_period_start ? new Date(subData.current_period_start * 1000) : null,
            currentPeriodEnd: subData.current_period_end ? new Date(subData.current_period_end * 1000) : null,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          },
        });

        console.log(`[Stripe] Subscription activated for user ${userId}`);
        break;
      }

      case "customer.subscription.updated": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const userId = parseInt(stripeSub.metadata?.userId ?? "0");
        if (!userId) break;

        const subAny = stripeSub as any;
        await db
          .update(subscriptions)
          .set({
            status: stripeSub.status as any,
            currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : null,
            currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : null,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          })
          .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id));

        console.log(`[Stripe] Subscription updated for user ${userId}: ${stripeSub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;

        await db
          .update(subscriptions)
          .set({ status: "canceled" })
          .where(eq(subscriptions.stripeSubscriptionId, stripeSub.id));

        console.log(`[Stripe] Subscription canceled: ${stripeSub.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;
        if (subscriptionId) {
          await db
            .update(subscriptions)
            .set({ status: "past_due" })
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
        }
        break;
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Error processing event:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
