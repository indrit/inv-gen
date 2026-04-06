import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/server/firebase-admin';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(key);
};

export async function POST(req: Request) {
  const stripe = getStripe();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe-signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        // Update user in Firestore
        await db.collection('users').doc(userId).set(
          {
            isPremium: true,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log(`User ${userId} upgraded to Premium`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Ensure the body isn't parsed before we get to it (Stripe needs the raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};
