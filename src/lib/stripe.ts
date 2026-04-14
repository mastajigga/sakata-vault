import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing. Stripe integrations will fail.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as any, // Maintien du support Next / Stripe
  appInfo: {
    name: "Kisakata",
    version: "1.0.0",
  },
});
