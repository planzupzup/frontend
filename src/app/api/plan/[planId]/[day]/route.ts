/* eslint-disable */

import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACK_HOST;

// Define your interfaces here, or in a separate types.ts file
interface PlanItem {
  id: string; // Replace with actual properties from your backend
  name: string;
  // ... other properties
}

interface PlanResponseData {
  result: PlanItem[];
  message?: string;
  status?: string;
  // ... other top-level properties
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string; day: string }> } // <-- CHANGE IS HERE
) {
  try {
    // Await params to get the actual values
    const resolvedParams = await params; // <-- AWAIT IS HERE
    const { planId, day } = resolvedParams; // Destructure the resolved params

    // 외부 API로 통신
    const response = await axios.get<PlanResponseData>(
      `${BACKEND_URL}/api/plan/${planId}/${day}`, // Use the destructured values
    );

    if (response.data && Array.isArray(response.data.result)) {
      const updatedResult = response.data.result.map((item) => ({ // item type is now inferred as PlanItem
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
    console.error('Error fetching plan data:', error); // Use console.error for errors
    return new NextResponse('Server error', {
      status: 500,
    });
  }
}

export const runtime = 'edge';