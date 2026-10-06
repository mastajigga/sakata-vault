import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';
import { stripeVerifySessionSchema } from '@/lib/schemas/validation';

export const dynamic = 'force-dynamic';

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    const validated = stripeVerifySessionSchema.parse({ sessionId });

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    // Vérifier l'identité de l'appelant (client anon suffit pour valider le JWT)
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Jeton invalide." }, { status: 401 });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(validated.sessionId, {
      expand: ['subscription', 'customer'],
    });

    // Vérifier que la session appartient bien à cet utilisateur
    if (session.metadata?.supabase_user_id !== user.id) {
      return NextResponse.json({ error: "Session non autorisée." }, { status: 403 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        verified: false,
        status: session.payment_status,
      });
    }

    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    if (session.mode !== 'subscription' || session.status !== 'complete' || !subscriptionId) {
      return NextResponse.json({ verified: false, error: 'Session sans abonnement finalisé.' }, { status: 409 });
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const period = periodOf(subscription);
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const subscriptionCustomer = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    if (!customerId || customerId !== subscriptionCustomer || !period.active) {
      return NextResponse.json({ verified: false, status: subscription.status }, { status: 409 });
    }
    if (session.amount_total === null || !session.currency) throw new Error('Montant Stripe absent');

    const { error: subscriptionError } = await supabaseAdmin.from(DB_TABLES.CHAT_SUBSCRIPTIONS).upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      tier: 'premium',
      status: 'active',
      current_period_start: new Date(period.start * 1000).toISOString(),
      current_period_end: new Date(period.end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (subscriptionError) throw subscriptionError;

    const { error: sessionError } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS).upsert({
      user_id: user.id,
      stripe_session_id: session.id,
      stripe_subscription_id: subscription.id,
      status: 'active',
      amount: session.amount_total,
      currency: session.currency,
      completed_at: new Date(session.created * 1000).toISOString(),
    }, { onConflict: 'stripe_session_id' });
    if (sessionError) throw sessionError;

    // A paid Premium subscription must not overwrite a valid Elite gift.
    const { data: grants, error: grantsError } = await supabaseAdmin.from('subscription_grants')
      .select('tier, expires_at').eq('user_id', user.id).is('revoked_at', null);
    if (grantsError) throw grantsError;
    const entitlements = (grants ?? []).filter(g => !g.expires_at || Date.parse(g.expires_at) > Date.now())
      .map(g => ({ tier: g.tier as string, end: g.expires_at as string | null, status: 'manual_grant' }));
    entitlements.push({ tier: 'premium', end: new Date(period.end * 1000).toISOString(), status: 'active' });
    entitlements.sort((a, b) => (Number(b.tier === 'elite') - Number(a.tier === 'elite')) ||
      ((b.end ? Date.parse(b.end) : Infinity) - (a.end ? Date.parse(a.end) : Infinity)));
    const entitlement = entitlements[0];
    const { error: profileError } = await supabaseAdmin.from(DB_TABLES.PROFILES).update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_tier: entitlement.tier,
      subscription_status: entitlement.status,
      subscription_end_date: entitlement.end,
    }).eq('id', user.id).select('id').single();
    if (profileError) throw profileError;

    return NextResponse.json(
      { verified: true, tier: entitlement.tier },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    console.error("Erreur vérification session Stripe:", err);
    return NextResponse.json(
      { error: "Erreur serveur : " + err.message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
