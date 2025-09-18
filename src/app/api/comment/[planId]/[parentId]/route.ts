/* eslint-disable */

import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_HOST;

export async function GET(req: NextRequest, { params } : { params : Promise<{ planId: string, parentId?: string }>} ) {
  const { planId, parentId } = await params;
  const page = req.nextUrl.searchParams.get('page');

  // Optionally validate or use `planId` dynamically
  try {
    // 외부 API로 통신
    let response;
    if(parentId) {
        response = await axios.get(
            `${BACKEND_URL}/api/comment/${planId}/${parentId}?page=${page}`,
          )
    } else {
        response = await axios.get(
            `${BACKEND_URL}/api/comment/${planId}?page=${page}`,
        )
    }

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

export const runtime = 'edge';