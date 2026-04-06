import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null; // Return null instead of crashing
  }
  return new Stripe(key);
};

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRICE_ID;
    
    // Safety check for production: If Stripe is not setup yet, return a mock response
    if (!stripe || !priceId) {
      console.warn('Stripe is not configured. Running in limited mode.');
      return NextResponse.json({ 
        id: 'mock_session_id', 
        message: 'Premium feature coming soon! Stripe is currently being configured.'
      });
    }

    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
    }

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
    // If it crashes, return a 200 with an error message so the frontend doesn't show a 500
    return NextResponse.json({ 
      error: 'Stripe configuration error. Please contact support.', 
      details: error.message 
    }, { status: 200 }); 
  }
}
