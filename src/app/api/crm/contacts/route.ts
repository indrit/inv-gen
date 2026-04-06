import { NextResponse } from 'next/server';
import { CRMService } from '@/server/services/crm.service';

export async function GET() {
  try {
    const contacts = await CRMService.getContacts();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('API Error (GET /api/crm/contacts):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contact = await CRMService.createContact(body);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/crm/contacts):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
