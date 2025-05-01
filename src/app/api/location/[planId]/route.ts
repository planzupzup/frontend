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
        latitude: 33,
        longitude: 121,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 1,
        category: "카페",
        image: {
          imageId: 1,
          imageUrl:
            "https://media.istockphoto.com/id/486403796/ko/%EC%82%AC%EC%A7%84/%EC%9D%B4-jeongbang-%ED%8F%AD%ED%8F%AC%EC%88%98%ED%98%95.jpg?s=612x612&w=0&k=20&c=o-ZYNBrNKMUrPKPChQIq3EucaMoLEVebOdwtqdl6aUs=",
        },
      },
      {
        locationId: 2,
        locationName: "test2",
        latitude: 34,
        longitude: 126,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 2,
        category: "식당",
        image: {
          imageId: 2,
          imageUrl:
            "https://media.istockphoto.com/id/486403796/ko/%EC%82%AC%EC%A7%84/%EC%9D%B4-jeongbang-%ED%8F%AD%ED%8F%AC%EC%88%98%ED%98%95.jpg?s=612x612&w=0&k=20&c=o-ZYNBrNKMUrPKPChQIq3EucaMoLEVebOdwtqdl6aUs=",
        },
      },
      {
        locationId: 3,
        locationName: "test3",
        latitude: 34,
        longitude: 128,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 3,
        category: "식당",
        image: {
          imageId: 3,
          imageUrl:
            "https://media.istockphoto.com/id/486403796/ko/%EC%82%AC%EC%A7%84/%EC%9D%B4-jeongbang-%ED%8F%AD%ED%8F%AC%EC%88%98%ED%98%95.jpg?s=612x612&w=0&k=20&c=o-ZYNBrNKMUrPKPChQIq3EucaMoLEVebOdwtqdl6aUs=",
        },
      },
      {
        locationId: 4,
        locationName: "test4",
        latitude: 37,
        longitude: 131,
        address: null,
        day: "2025-07-01",
        scheduleOrder: 1,
        category: "식당",
        image: {
          imageId: 4,
          imageUrl:
            "https://media.istockphoto.com/id/486403796/ko/%EC%82%AC%EC%A7%84/%EC%9D%B4-jeongbang-%ED%8F%AD%ED%8F%AC%EC%88%98%ED%98%95.jpg?s=612x612&w=0&k=20&c=o-ZYNBrNKMUrPKPChQIq3EucaMoLEVebOdwtqdl6aUs=",
        },
      },
    ],
    status_message: "지역목록조회가 성공적으로 되었습니다.",
  });
}
