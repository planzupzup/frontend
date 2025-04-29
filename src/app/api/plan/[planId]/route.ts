import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { planId: string } }) {
  const { planId } = params;

  if (planId === '3') {
    return NextResponse.json({
      status_code: 200,
      result: {
        planId: 3,
        title: "plan test",
        content: "내용내용",
        startDate: "2025-07-01",
        endDate: "2025-10-01",
        destinationId: 1,
        destinationName: "미국",
      },
      status_message: "계획상세조회가 성공적으로 되었습니다.",
    });
  }

  return NextResponse.json({
    status_code: 404,
    result: null,
    status_message: "해당 계획을 찾을 수 없습니다.",
  }, { status: 404 });
}