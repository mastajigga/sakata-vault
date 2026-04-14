import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
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

    // Vérifier l'identité de l'appelant
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
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
      await supabaseAdmin
        .from(DB_TABLES.PROFILES)
        .update({
          stripe_subscription_id: typeof sub === 'string' ? sub : sub?.id,
          subscription_tier: 'premium',
          subscription_status: 'active',
          subscription_end_date: sub?.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        .eq('id', user.id);
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
