import { NextResponse } from 'next/server';
import { CMSService } from '@/server/services/cms.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const content = await CMSService.getContentBySlug(slug);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('API Error (GET /api/cms/content/[slug]):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
