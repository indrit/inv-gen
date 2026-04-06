import { NextResponse } from 'next/server';
import { EmailService } from '@/server/services/email.service';

export async function GET() {
  try {
    const subscribers = await EmailService.getSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('API Error (GET /api/email/subscribers):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscriber = await EmailService.createSubscriber(body);
    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/email/subscribers):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
