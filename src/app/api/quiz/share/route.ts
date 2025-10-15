import { NextRequest, NextResponse } from 'next/server';
import { incrementShareCount } from '@/models/quiz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uuid } = body;

    if (!uuid) {
      return NextResponse.json(
        { error: 'Missing uuid' },
        { status: 400 }
      );
    }

    const result = await incrementShareCount(uuid);

    if (!result) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, share_count: result.share_count });
  } catch (error) {
    console.error('Quiz share error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


