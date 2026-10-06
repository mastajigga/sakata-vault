import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';
import { stripeCheckoutSchema } from '@/lib/schemas/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
       return NextResponse.json({ error: "Non autorisé. Jeton manquant." }, { status: 401 });
    }

    // Validation JWT avec le client anon (ne nécessite pas la service role key)
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé. Jeton invalide." }, { status: 401 });
    }

    const userId = user.id;
    const body = await req.json().catch(() => ({}));
    const validated = stripeCheckoutSchema.parse(body);
    const { priceId } = validated;

    // Check if user already has active premium subscription (prevent double-buy)
    const { data: existingSub, error: existingError } = await supabaseAdmin
      .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('tier', 'premium')
      .eq('status', 'active')
      .maybeSingle();
    if (existingError) throw existingError;

    if (
      existingSub &&
      new Date(existingSub.current_period_end) > new Date()
    ) {
      return NextResponse.json(
        { error: "Vous êtes déjà Premium jusqu'au " + new Date(existingSub.current_period_end).toLocaleDateString('fr-FR') },
        { status: 400 }
      );
    }

    // Récupérer le profil pour voir s'il a déjà un stripe_customer_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .select('stripe_customer_id, email, first_name, last_name, username')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Créer un nouveau client Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : (profile?.username || undefined),
        metadata: {
          supabase_user_id: userId,
        },
      }, { idempotencyKey: `sakata-customer-${userId}` });

      customerId = customer.id;

      // Sauvegarder le customer ID en DB (en utilisant le service role pour bypasser RLS si besoin, bien que l'utilisateur puisse éditer son propre profil)
      const { error: customerError } = await supabaseAdmin
        .from(DB_TABLES.PROFILES)
        .update({ stripe_customer_id: customerId })
        .eq('id', userId).select('id').single();
      if (customerError) throw customerError;
    }

    async function remember(session: Stripe.Checkout.Session) {
      if (session.amount_total === null || !session.currency) throw new Error('Montant Stripe absent');
      // Do not reset a session already finalized by the webhook.
      const { error } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS).upsert({
        user_id: userId, stripe_session_id: session.id, status: 'pending',
        amount: session.amount_total, currency: session.currency,
      }, { onConflict: 'stripe_session_id', ignoreDuplicates: true });
      if (error) throw error;
      const { error: amountError } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS)
        .update({ amount: session.amount_total, currency: session.currency })
        .eq('stripe_session_id', session.id).eq('status', 'pending');
      if (amountError) throw amountError;
    }

    // A Checkout Session expires after 24h at most: older rows cannot be reopened
    // (a paid one is caught by the subscriptions check below). Bounded to stay
    // within the Netlify function timeout.
    const { data: pending, error: pendingError } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS)
      .select('stripe_session_id').eq('user_id', userId).eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false }).limit(5);
    if (pendingError) throw pendingError;
    for (const row of pending ?? []) {
      let session: Stripe.Checkout.Session;
      try {
        session = await stripe.checkout.sessions.retrieve(row.stripe_session_id);
      } catch (err: any) {
        // Session from another Stripe mode (test/live) or account: it can never
        // complete here, so it must not block a new payment.
        if (err?.code !== 'resource_missing') throw err;
        console.warn('[Stripe Checkout] Session pending inconnue de Stripe, marquée failed:', row.stripe_session_id);
        const { error } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS)
          .update({ status: 'failed' }).eq('stripe_session_id', row.stripe_session_id).eq('status', 'pending');
        if (error) throw error;
        continue;
      }
      if (session.status === 'open' && session.url) {
        await remember(session);
        return NextResponse.json({ url: session.url, sessionId: session.id });
      }
      if (session.status === 'complete') {
        if (session.payment_status !== 'paid') {
          return NextResponse.json({ error: 'Paiement en cours de confirmation.' }, { status: 409 });
        }
        if (session.amount_total === null || !session.currency) throw new Error('Montant Stripe absent');
        const { error } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS).update({
          status: 'active', amount: session.amount_total, currency: session.currency,
          stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
        }).eq('stripe_session_id', session.id).eq('status', 'pending');
        if (error) throw error;
        continue;
      }
      const { error } = await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS)
        .update({ status: 'failed' }).eq('stripe_session_id', session.id).eq('status', 'pending');
      if (error) throw error;
    }

    // Recover an open session even if its database write failed. The latest
    // terminal session anchors a stable key, shared by concurrent requests,
    // including requests for different prices (Stripe rejects that conflict).
    let previousSessionId = 'initial';
    for await (const session of stripe.checkout.sessions.list({ customer: customerId, limit: 100 })) {
      if (session.mode !== 'subscription' || session.metadata?.supabase_user_id !== userId) continue;
      if (session.status === 'open' && session.url) {
        await remember(session);
        return NextResponse.json({ url: session.url, sessionId: session.id });
      }
      if (previousSessionId === 'initial') previousSessionId = session.id;
    }
    // Covers successful payments whose webhook has not yet updated Supabase.
    for await (const subscription of stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 })) {
      if (['active', 'trialing', 'past_due', 'unpaid', 'incomplete', 'paused'].includes(subscription.status)) {
        return NextResponse.json({ error: 'Un abonnement existe déjà. Utilisez le portail de facturation.' }, { status: 409 });
      }
    }

    // Définir l'URL de base (gérer le dev local vs la prod Netlify)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Créer la Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium?canceled=true`,
      metadata: {
        supabase_user_id: userId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        }
      }
    }, { idempotencyKey: `sakata-checkout-${userId}-${previousSessionId}` });

    if (checkoutSession.status !== 'open' || !checkoutSession.url) {
      return NextResponse.json({ error: 'Session déjà finalisée ou expirée. Réessayez.' }, { status: 409 });
    }
    await remember(checkoutSession);

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    console.error("[Stripe Checkout] Session creation failed:", {
      error: err instanceof Error ? err.message : String(err),
      action: "create_checkout_session",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
