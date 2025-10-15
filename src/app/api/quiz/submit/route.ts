import { NextRequest, NextResponse } from 'next/server';
import { insertQuizResult } from '@/models/quiz';
import { getClientIp } from '@/lib/ip';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mbtiType, scores, answers, locale } = body;

    // 验证数据
    if (!mbtiType || !scores || !answers || !locale) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 获取IP地址
    const ipAddress = await getClientIp();

    // 生成 UUID
    const uuid = randomUUID();

    // 保存到数据库
    const result = await insertQuizResult({
      uuid,
      mbti_type: mbtiType,
      scores: JSON.stringify(scores),
      answers: JSON.stringify(answers),
      locale,
      ip_address: ipAddress,
    });

    if (!result) {
      throw new Error('Failed to save result');
    }

    return NextResponse.json({ uuid: result.uuid });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


