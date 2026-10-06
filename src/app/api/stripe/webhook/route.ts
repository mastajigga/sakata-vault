import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';

export const dynamic = 'force-dynamic';

// A retry cannot fix these (Payment Link, Dashboard-created subscription...):
// answering 500 would make Stripe retry for days, then disable the endpoint.
class PermanentWebhookError extends Error {}

// The configured API returns top-level periods; recent Stripe APIs use items.
function periodOf(subscription: Stripe.Subscription) {
  const legacy = subscription as Stripe.Subscription & {
    current_period_start?: number; current_period_end?: number;
  };
  const start = legacy.current_period_start ?? subscription.items.data[0]?.current_period_start;
  const end = legacy.current_period_end ?? subscription.items.data[0]?.current_period_end;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error('Période Stripe invalide');
  }
  // Stripe controls the grace period: past_due remains entitled even after period end.
  return { start, end, active: subscription.status === 'past_due' || (subscription.status === 'active' && end * 1000 > Date.now()) };
}

async function synchronize(subscription: Stripe.Subscription, userId: string) {
  const period = periodOf(subscription);
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const { error: subscriptionError } = await supabaseAdmin.from(DB_TABLES.CHAT_SUBSCRIPTIONS).upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    tier: period.active ? 'premium' : 'free',
    status: period.active ? 'active' : subscription.status === 'past_due' ? 'past_due' : 'cancelled',
    current_period_start: new Date(period.start * 1000).toISOString(),
    current_period_end: new Date(period.end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (subscriptionError) throw subscriptionError;

  const { data: grants, error: grantsError } = await supabaseAdmin.from('subscription_grants')
    .select('tier, expires_at').eq('user_id', userId).is('revoked_at', null);
  if (grantsError) throw grantsError;
  const entitlements = (grants ?? []).filter(g => !g.expires_at || Date.parse(g.expires_at) > Date.now())
    .map(g => ({ tier: g.tier as string, end: g.expires_at as string | null, status: 'manual_grant' }));
  if (period.active) entitlements.push({ tier: 'premium', end: new Date(period.end * 1000).toISOString(), status: 'active' });
  entitlements.sort((a, b) => (Number(b.tier === 'elite') - Number(a.tier === 'elite')) ||
    ((b.end ? Date.parse(b.end) : Infinity) - (a.end ? Date.parse(a.end) : Infinity)));
  const entitlement = entitlements[0];
  const { error: profileError } = await supabaseAdmin.from(DB_TABLES.PROFILES).update({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_tier: entitlement?.tier ?? 'free',
    subscription_status: entitlement?.status ?? subscription.status,
    subscription_end_date: entitlement ? entitlement.end : new Date(period.end * 1000).toISOString(),
  }).eq('id', userId).select('id').single();
  if (profileError) throw profileError;
}

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error('Webhook signature error:', error);
    return new NextResponse('Invalid webhook signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
      if (session.mode !== 'subscription') return NextResponse.json({ received: true });
      const userId = session.metadata?.supabase_user_id;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      if (!userId || !subscriptionId) throw new PermanentWebhookError(`Session ${session.id} sans utilisateur ou abonnement`);
      if (session.payment_status !== 'paid') return NextResponse.json({ received: true });
      if (session.amount_total === null || !session.currency) throw new Error('Montant Stripe absent');
      // Persist the payment even when an old completed event is retried after cancellation.
      const { error } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS).upsert({
        user_id: userId, stripe_session_id: session.id, stripe_subscription_id: subscriptionId,
        status: 'active', amount: session.amount_total, currency: session.currency,
        completed_at: new Date(event.created * 1000).toISOString(),
      }, { onConflict: 'stripe_session_id' });
      if (error) throw error;
      await synchronizeCurrent(subscriptionId, userId);
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      // Fetch current state instead of replaying a potentially stale event payload.
      const subscription = await stripe.subscriptions.retrieve(event.data.object.id);
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
      const { data: profile, error } = await supabaseAdmin.from(DB_TABLES.PROFILES)
        .select('id').eq('stripe_customer_id', customerId).maybeSingle();
      if (error) throw error;
      const userId = subscription.metadata.supabase_user_id || profile?.id;
      if (!userId) throw new PermanentWebhookError(`Abonnement ${subscription.id} sans profil associé`);
      await synchronizeCurrent(subscription.id, userId);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof PermanentWebhookError) {
      console.error(`Webhook ${event.type} (${event.id}) ignoré, erreur définitive:`, error.message);
      return NextResponse.json({ received: true, ignored: error.message });
    }
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}

async function synchronizeCurrent(subscriptionId: string, userId: string) {
  let subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { data: existing, error } = await supabaseAdmin.from(DB_TABLES.CHAT_SUBSCRIPTIONS)
    .select('stripe_subscription_id').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  // A delayed cancellation of an older subscription must not remove a new one.
  if (existing?.stripe_subscription_id && existing.stripe_subscription_id !== subscription.id) {
    const current = await stripe.subscriptions.retrieve(existing.stripe_subscription_id);
    if (periodOf(current).active) subscription = current;
  }
  await synchronize(subscription, userId);
}
