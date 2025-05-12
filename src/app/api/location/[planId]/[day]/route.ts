import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_HOST;

export async function GET(
  req: NextRequest,
  { params }: { params: { planId: string, day: string } }
) {

  // Optionally validate or use `planId` dynamically
  try {
    // 외부 API로 통신
    const response = await axios.get(
      `${BACKEND_URL}/api/location/${params.planId}/${params.day}`,
    )
    if (response.data && Array.isArray(response.data.result)) {
      const updatedResult = response.data.result.map((item:any) => ({
        ...item
      }));

      return new NextResponse(JSON.stringify({ ...response.data, result: updatedResult }), {
        status: 200,
      });
    } else {
      return new NextResponse(JSON.stringify(response.data), {
        status: 200,
      });
    }
  } catch (error) {
    console.log(error)
    return new NextResponse('server error', {
      status: 500,
    })
  }
}
