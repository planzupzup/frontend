import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { planId: string } }
) {

  // Optionally validate or use `planId` dynamically
  return NextResponse.json({
    status_code: 200,
    result: [
      {
        locationId: 1,
        locationName: "ㅁ",
        latitude: 12.4,
        longitude: 12.5,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 1,
        category: "카페",
        image: {
          imageId: 1,
          imageUrl:
            "https://travel1030.s3.ap-southeast-2.amazonaws.com/2ff8c289-f733-4043-8949-9ad4f51fc1d8-%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-11-24%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.18.03.png",
        },
      },
      {
        locationId: 2,
        locationName: "test2",
        latitude: 12.4,
        longitude: 12.9,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 2,
        category: "식당",
        image: {
          imageId: 2,
          imageUrl:
            "https://travel1030.s3.ap-southeast-2.amazonaws.com/b8d0e785-0f06-4388-af71-7ccbc19cb8c6-%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-11-24%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.18.03.png",
        },
      },
      {
        locationId: 3,
        locationName: "test3",
        latitude: 12.4,
        longitude: 12.9,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 3,
        category: "식당",
        image: {
          imageId: 3,
          imageUrl:
            "https://travel1030.s3.ap-southeast-2.amazonaws.com/b1062d25-78a7-4dc3-bda6-016c4bd50494-%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-11-24%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.18.03.png",
        },
      },
      {
        locationId: 4,
        locationName: "test4",
        latitude: 12.4,
        longitude: 12.9,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 1,
        category: "식당",
        image: {
          imageId: 4,
          imageUrl:
            "https://travel1030.s3.ap-southeast-2.amazonaws.com/3b1c43b7-6d00-4c4e-8055-836f6d45159c-%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-11-24%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.18.03.png",
        },
      },
    ],
    status_message: "지역목록조회가 성공적으로 되었습니다.",
  });
}
