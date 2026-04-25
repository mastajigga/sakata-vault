import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';

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
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Identifiant de prix manquant." }, { status: 400 });
    }

    // Check if user already has active premium subscription (prevent double-buy)
    const { data: existingSub } = await supabaseAdmin
      .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('tier', 'premium')
      .eq('status', 'active')
      .single();

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
    const { data: profile } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .select('stripe_customer_id, email, first_name, last_name, username')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Créer un nouveau client Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : (profile?.username || undefined),
        metadata: {
          supabase_user_id: userId,
        },
      });

      customerId = customer.id;

      // Sauvegarder le customer ID en DB (en utilisant le service role pour bypasser RLS si besoin, bien que l'utilisateur puisse éditer son propre profil)
      await supabaseAdmin
        .from(DB_TABLES.PROFILES)
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
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
    });

    // Store session in subscription_sessions to track and prevent duplicates
    await supabaseAdmin.from(DB_TABLES.SUBSCRIPTION_SESSIONS).insert({
      user_id: userId,
      stripe_session_id: checkoutSession.id,
      status: 'pending',
      amount: 0,
      currency: 'EUR',
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });

  } catch (err: any) {
    console.error("[Stripe Checkout] Session creation failed:", {
      error: err instanceof Error ? err.message : String(err),
      action: "create_checkout_session",
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Erreur serveur lors de la création de la session de paiement" }, { status: 500 });
  }
}
