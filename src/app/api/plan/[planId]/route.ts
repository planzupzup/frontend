/* eslint-disable */

import { BACK_HOST } from '@/app/components/modal/Login';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_HOST;

export async function GET(req: NextRequest, { params } : { params : Promise<{ planId: string }>} ) {
  const { planId } = await params;

  // Optionally validate or use `planId` dynamically
  try {
    // 외부 API로 통신
    const response = await axios.get(
      `${BACKEND_URL}/api/plan/${planId}`,
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