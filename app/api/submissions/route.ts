import { NextRequest, NextResponse } from 'next/server';
import { submitResearchData } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await submitResearchData(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      submission: result.submission,
      isLiveDb: result.isLiveDb,
    });
  } catch (error: any) {
    console.error('Error handling submission POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing research submission.' },
      { status: 500 }
    );
  }
}
