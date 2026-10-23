import { NextRequest, NextResponse } from 'next/server';
import { fetchResearchAggregate } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') as 'demo' | 'live' | null;

    const data = await fetchResearchAggregate(mode || undefined);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching research aggregate:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to aggregate research dataset.' },
      { status: 500 }
    );
  }
}
