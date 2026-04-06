import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const createCheckoutSession = async (userId: string, email: string) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email }),
    });

    const session = await response.json();
    if (session.error) {
      throw new Error(session.error);
    }

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
