/**
 * Creates the Spitfire PM Pro product and £19.99/month price in Stripe.
 * Run once: node scripts/setup-stripe-product.mjs
 */
import 'dotenv/config';
import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('STRIPE_SECRET_KEY not set');
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });

// Check existing products
const products = await stripe.products.list({ limit: 20 });
let product = products.data.find(p => p.name === 'Spitfire PM Pro');

if (!product) {
  product = await stripe.products.create({
    name: 'Spitfire PM Pro',
    description: 'Full access to all 7 levels, 100+ PM simulations, AI feedback, and interview prep. Cancel anytime.',
  });
  console.log('Created product:', product.id);
} else {
  console.log('Product already exists:', product.id);
}

// Check existing prices for this product
const prices = await stripe.prices.list({ product: product.id, limit: 20 });
let price = prices.data.find(p =>
  p.unit_amount === 1999 &&
  p.currency === 'gbp' &&
  p.recurring?.interval === 'month' &&
  p.active
);

if (!price) {
  price = await stripe.prices.create({
    product: product.id,
    unit_amount: 1999, // £19.99 in pence
    currency: 'gbp',
    recurring: { interval: 'month' },
    nickname: 'Spitfire PM Pro Monthly',
  });
  console.log('Created price:', price.id);
} else {
  console.log('Price already exists:', price.id);
}

console.log('\n=== STRIPE SETUP COMPLETE ===');
console.log('Product ID:', product.id);
console.log('Price ID:  ', price.id);
console.log('\nSet this as your STRIPE_PRICE_ID environment variable.');
