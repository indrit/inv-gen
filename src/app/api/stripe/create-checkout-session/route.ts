import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  return new Stripe(key);
};

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;
    
    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not defined in environment variables');
      return NextResponse.json({ error: 'Stripe is not correctly configured' }, { status: 500 });
    }

    // Default origin for local and production
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://freeonline-invoice-generator.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
