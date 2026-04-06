import { NextResponse } from 'next/server';
import { EmailService } from '@/server/services/email.service';

export async function GET() {
  try {
    const campaigns = await EmailService.getCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('API Error (GET /api/email/campaigns):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaign = await EmailService.createCampaign(body);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/email/campaigns):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
