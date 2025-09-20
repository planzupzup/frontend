export const getKoreanKeyword = async (keyword: string): Promise<string | null> => {
  const serviceKey = process.env.NEXT_PUBLIC_KOR_SERVICE_API_KEY;
  if (!serviceKey) {
    // console.error("API key for KorService2 is missing.");
    return null;
  }

  const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?serviceKey=${serviceKey}&keyword=${encodeURIComponent(
    keyword
  )}&_type=json&arrange=A&numOfRows=1&MobileOS=ETC&MobileApp=AppTest`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      return null;
    }
    const data = await response.json();

    const items = data.response?.body?.items?.item;
    if (items && items.length > 0) {
      return items[0].firstimage || items[0].firstimage2 || null;
    }
    return null;
  } catch (error) {
    // console.error("Failed to fetch from KorService2:", error);
    return null;
  }
};
