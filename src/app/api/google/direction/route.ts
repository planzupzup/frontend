import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const mode = searchParams.get('mode');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

  if (!origin || !destination || !apiKey) {
    return NextResponse.json({ error: 'Origin, destination, and API key are required.' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`
    );

    if (!response.ok) {
      console.error('Google Maps API 응답 오류:', response.status, response.statusText);
      const errorData = await response.json();
      return NextResponse.json({ error: `Google Maps API error: ${errorData?.error_message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Google Maps API 요청 실패:', error);
    return NextResponse.json({ error: 'Failed to fetch directions from Google Maps API.' }, { status: 500 });
  }
}