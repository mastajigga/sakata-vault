import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';
import { stripePortalSchema } from '@/lib/schemas/validation';

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

    const body = await req.json().catch(() => ({}));
    const validated = stripePortalSchema.parse(body);

    // Récupérer le stripe_customer_id depuis le profil
    const { data: profile } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Aucun abonnement Stripe associé à ce compte." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Créer une session Customer Portal Stripe
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/profil`,
    });

    return NextResponse.json(
      { url: portalSession.url },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    console.error("Erreur création portail Stripe:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
