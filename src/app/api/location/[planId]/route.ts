import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { planId: string } }
) {

  // Optionally validate or use `planId` dynamically
  try {
    // 외부 API로 통신
    const response = await axios.get(
      `http://43.203.206.198:8080/api/location/1/2025-03-21`,
    )
    if (response.data && Array.isArray(response.data.result)) {
      const updatedResult = response.data.result.map((item:any) => ({
        ...item,
        day: '2025-07-01',
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
