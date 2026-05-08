import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazy Stripe client. Throws clearly at first call if STRIPE_SECRET_KEY is missing,
 * but does NOT crash at module import — so prod builds without the key in local env
 * (Netlify build vs local) still pass page-data collection.
 */
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  _stripe = new Stripe(key, {
    apiVersion: "2022-11-15" as any,
    appInfo: { name: "Sakata", version: "1.0.0" },
  });
  return _stripe;
}

/**
 * Proxy that defers instantiation until the first property access.
 * Existing imports `import { stripe } from "@/lib/stripe"` keep working.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const inst = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = inst[prop];
    return typeof value === "function" ? (value as Function).bind(inst) : value;
  },
});
