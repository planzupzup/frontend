import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { planId: string } }) {
  const { planId } = params;

  // Optionally validate or use `planId` dynamically
  try {
    // 외부 API로 통신
    const response = await axios.get(
      `http://43.203.206.198:8080/api/plan/${params.planId}`,
    )
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return new NextResponse('server error', {
      status: 500,
    })
  }
}