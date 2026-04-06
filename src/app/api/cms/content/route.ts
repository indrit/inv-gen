import { NextResponse } from 'next/server';
import { CMSService } from '@/server/services/cms.service';

export async function GET() {
  try {
    const content = await CMSService.getAllContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('API Error (GET /api/cms/content):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = await CMSService.createContent(body);
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/cms/content):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
