import express from 'express';
import Stripe from 'stripe';
import { adminDb } from '../../lib/firebase-admin';

const router = express.Router();

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(key);
};

// Create a checkout session
router.post('/create-checkout-session', async (req, res, next) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return res.status(500).json({ error: 'STRIPE_PRICE_ID is not defined' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/dashboard`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    next(error);
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      // Update user in Firestore
      await adminDb.collection('users').doc(userId).set(
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

  res.json({ received: true });
});

export default router;
