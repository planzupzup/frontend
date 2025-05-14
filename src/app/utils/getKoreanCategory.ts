export const getKoreanCategory = (types: string[]):string => {
    if (!types || types.length === 0) {
        return "기타";
      }

    for(const type of types) {
        switch (type) {
            case "cafe":
                return "카페";
            case "restaurant":
                return "식당";
            case "transit_station":
                return "역";
            case "tourist_attraction":
            case "point_of_interest":
                return "관광명소";
            default:
                break;
        }
    }

    return "기타";
}