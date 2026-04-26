import { NextResponse } from 'next/server';
import Stripe from 'stripe';
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
    const typedEvent = event as Stripe.Event;

    switch (typedEvent.type) {
      case 'checkout.session.completed': {
        const session = typedEvent.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = (session.metadata?.supabase_user_id as string) || undefined;
        const sessionId = session.id;

        if (userId && subscriptionId) {
          // Get subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const currentPeriodStart = new Date(((subscription as any).current_period_start || 0) * 1000);
          const currentPeriodEnd = new Date(((subscription as any).current_period_end || 0) * 1000);

          // Create or update chat_subscriptions entry
          const { data: existingSub } = await supabaseAdmin
            .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
            .select('*')
            .eq('user_id', userId)
            .single();

          if (existingSub) {
            // Update existing
            await supabaseAdmin
              .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                tier: 'premium',
                status: 'active',
                current_period_start: currentPeriodStart.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId);
          } else {
            // Create new
            await supabaseAdmin
              .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
              .insert({
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                tier: 'premium',
                status: 'active',
                current_period_start: currentPeriodStart.toISOString(),
                current_period_end: currentPeriodEnd.toISOString(),
              });
          }

          // Mark session as completed
          await supabaseAdmin
            .from(DB_TABLES.SUBSCRIPTION_SESSIONS)
            .update({
              status: 'active',
              stripe_subscription_id: subscriptionId,
              completed_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', sessionId);

          // Also update profiles for backward compatibility
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
        const subscription = typedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;
        const currentPeriodEnd = new Date(((subscription as any).current_period_end || 0) * 1000);

        // Update chat_subscriptions
        await supabaseAdmin
          .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
          .update({
            status: status === 'active' ? 'active' : status === 'past_due' ? 'past_due' : 'cancelled',
            current_period_end: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        // Update profiles for backward compatibility
        await supabaseAdmin
          .from(DB_TABLES.PROFILES)
          .update({
            subscription_status: status,
            subscription_end_date: currentPeriodEnd.toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        // If unpaid or canceled, downgrade
        if (['canceled', 'unpaid', 'past_due'].includes(status)) {
             await supabaseAdmin
               .from(DB_TABLES.PROFILES)
               .update({ subscription_tier: 'free' })
               .eq('stripe_customer_id', customerId);

             await supabaseAdmin
               .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
               .update({ tier: 'free' })
               .eq('stripe_customer_id', customerId);
        } else if (status === 'active') {
             await supabaseAdmin
               .from(DB_TABLES.PROFILES)
               .update({ subscription_tier: 'premium' })
               .eq('stripe_customer_id', customerId);

             await supabaseAdmin
               .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
               .update({ tier: 'premium' })
               .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = typedEvent.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update chat_subscriptions
        await supabaseAdmin
          .from(DB_TABLES.CHAT_SUBSCRIPTIONS)
          .update({
            status: 'cancelled',
            tier: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        // Downgrade to free in profiles
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
        console.log(`Unhandled event type ${typedEvent.type}`);
    }
  } catch (error: any) {
    console.error('Webhook payload error processing:', error);
    return new NextResponse(`Webhook processing error: ${error.message}`, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
