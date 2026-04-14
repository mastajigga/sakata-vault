import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin'; 
// Note: webhook uses supabaseAdmin to bypass RLS because it is a server-to-server call.
import { DB_TABLES } from '@/lib/constants/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error constructing event: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.metadata?.supabase_user_id;

        if (userId) {
          // Attribuer le grade Premium (par défaut, ajuster selon le `priceId` si besoin de 'elite')
          await supabaseAdmin
            .from(DB_TABLES.PROFILES)
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_tier: 'premium',
              subscription_status: 'active'
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // update status and end date
        await supabaseAdmin
          .from(DB_TABLES.PROFILES)
          .update({
            subscription_status: subscription.status,
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        // If unpaid or canceled, downgrade gracefully if required.
        if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
             await supabaseAdmin
               .from(DB_TABLES.PROFILES)
               .update({
                  subscription_tier: 'free'
               })
               .eq('stripe_customer_id', customerId);
        } else if (subscription.status === 'active') {
             await supabaseAdmin
               .from(DB_TABLES.PROFILES)
               .update({
                  subscription_tier: 'premium'
               })
               .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Downgrade to free entirely
        await supabaseAdmin
          .from(DB_TABLES.PROFILES)
          .update({
            stripe_subscription_id: null,
            subscription_status: 'canceled',
            subscription_tier: 'free',
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error: any) {
    console.error('Webhook payload error processing:', error);
    return new NextResponse(`Webhook processing error: ${error.message}`, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
