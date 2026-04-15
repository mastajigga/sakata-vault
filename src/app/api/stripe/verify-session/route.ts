import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!sessionId) {
      return NextResponse.json({ error: "session_id manquant." }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    // Vérifier l'identité de l'appelant (client anon suffit pour valider le JWT)
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Jeton invalide." }, { status: 401 });
    }

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
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

    // Forcer la mise à jour si le webhook n'est pas encore passé
    const { data: profile } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile?.subscription_tier !== 'premium') {
      const sub = session.subscription as any;
      const customer = session.customer as any;
      const subId = typeof sub === 'string' ? sub : sub?.id;
      const customerId = typeof customer === 'string' ? customer : customer?.id;
      const periodEnd = sub?.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

      // Update profiles
      await supabaseAdmin
        .from(DB_TABLES.PROFILES)
        .update({
          stripe_subscription_id: subId,
          subscription_tier: 'premium',
          subscription_status: 'active',
          subscription_end_date: periodEnd,
        })
        .eq('id', user.id);

      // Create or update chat_subscriptions
      const { data: existingSub } = await supabaseAdmin
        .from('chat_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingSub) {
        await supabaseAdmin
          .from('chat_subscriptions')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            tier: 'premium',
            status: 'active',
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      } else {
        await supabaseAdmin
          .from('chat_subscriptions')
          .insert({
            user_id: user.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            tier: 'premium',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd,
          });
      }
    }

    return NextResponse.json(
      { verified: true, tier: 'premium' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error("Erreur vérification session Stripe:", err);
    return NextResponse.json(
      { error: "Erreur serveur : " + err.message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
