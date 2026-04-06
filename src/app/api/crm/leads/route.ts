import { NextResponse } from 'next/server';
import { CRMService } from '@/server/services/crm.service';

export async function GET() {
  try {
    const leads = await CRMService.getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('API Error (GET /api/crm/leads):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await CRMService.createLead(body);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/crm/leads):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
