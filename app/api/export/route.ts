import { NextRequest, NextResponse } from 'next/server';
import {
  fetchResearchAggregate,
  generateAggregateCSV,
  generateVennRegionsCSV,
  generateTruthTableCSV,
} from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'aggregate';
    const mode = searchParams.get('mode') as 'demo' | 'live' | null;

    const data = await fetchResearchAggregate(mode || undefined);

    let csvContent = '';
    let filename = '';

    if (type === 'venn') {
      csvContent = generateVennRegionsCSV(data);
      filename = `exam_stress_triangle_venn_regions_${Date.now()}.csv`;
    } else if (type === 'truth_table') {
      csvContent = generateTruthTableCSV(data);
      filename = `exam_stress_triangle_truth_tables_${Date.now()}.csv`;
    } else {
      csvContent = generateAggregateCSV(data);
      filename = `exam_stress_triangle_aggregate_stats_${Date.now()}.csv`;
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('CSV export failure:', error);
    return NextResponse.json(
      { success: false, error: 'Could not generate CSV export.' },
      { status: 500 }
    );
  }
}
