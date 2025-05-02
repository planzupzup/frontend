// kakaoMapService.ts

import { useCallback } from "react";

interface Place {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface KakaoMapState {
  kakaoMap: any;
  placesService?: any;
  markers: any[];
  setKakaoMap: (map: any) => void;
  setPlacesService?: (service: any) => void;
  setMarkers: (markers: any[]) => void;
  searchInput?: string;
  setSearchInput?: (input: string) => void;
  places?: Place[];
  setPlaces?: (places: Place[]) => void;
}

export const useKakaoMapService = (mapRef: React.RefObject<HTMLDivElement | null>, state: KakaoMapState) => {
  const {
    kakaoMap,
    setKakaoMap,
    placesService,
    setPlacesService,
    markers,
    setMarkers,
    searchInput,
    setSearchInput,
    places,
    setPlaces,
  } = state;

  const loadKakaoMapScript = (latitude?:number, longitude?:number) => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_APP_KEY;

    if (!kakaoKey) {
      console.error("❌ Kakao Map API Key가 설정되지 않았습니다.");
      return;
    }

    // 기존 스크립트가 있는지 확인
    const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
    if (existingScript) {
      console.warn("⚠️ 기존 Kakao 스크립트가 이미 있습니다. 제거 후 재삽입합니다.");
      existingScript.remove();
    }

    // 스크립트 생성
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    script.defer = true;

    // 성공 시
    script.onload = () => {
      console.log("✅ Kakao Map 스크립트 로드 완료");
      if ((window as any).kakao && (window as any).kakao.maps) {
        (window as any).kakao.maps.load(() => {
          console.log("✅ Kakao Map API 로딩 완료 (maps.load)");

          const container = mapRef.current;
          if (!container) {
            console.error("❌ mapRef가 유효하지 않습니다.");
            return;
          }

          const defaultLat = 37.5665; // 서울
          const defaultLng = 126.9780; // 서울

          const centerLat = latitude !== undefined ? latitude : defaultLat;
          const centerLng = longitude !== undefined ? longitude : defaultLng;

          const options = {
            center: new (window as any).kakao.maps.LatLng(centerLat, centerLng),
            level: 3,
          };

          const map = new (window as any).kakao.maps.Map(container, options);
          const places = new (window as any).kakao.maps.services.Places();

          if(setPlacesService) setPlacesService(places);
          console.log("✅ 지도 및 장소 서비스 초기화 완료");

          const newMarker = new (window as any).kakao.maps.Marker({
            map: map,
            position: new (window as any).kakao.maps.LatLng(latitude, longitude),
          });
          setMarkers([newMarker]);

          setKakaoMap(map);
      
          if (latitude && longitude) {
            const first = new (window as any).kakao.maps.LatLng(latitude, longitude);
            kakaoMap.panTo(first);
          }
        });
      } else {
        console.error("❌ window.kakao 또는 kakao.maps가 존재하지 않습니다.");
      }
    };

    // 실패 시
    script.onerror = () => {
      console.error("❌ Kakao Map 스크립트 로드 실패");
    };

    document.head.appendChild(script);
  };

  const searchPlace = () => {
    if (placesService) {
      placesService.keywordSearch(searchInput, placesSearchCB);
    }
  };

  const displaySearchMarkers = useCallback((places: Place[]) => {
    if (!kakaoMap) return;

    markers.forEach(marker => marker.setMap(null));
    const newMarkers = places.map(place => {
      const marker = new (window as any).kakao.maps.Marker({
        map: kakaoMap,
        position: new (window as any).kakao.maps.LatLng(place.y, place.x),
      });
      return marker;
    });
    setMarkers(newMarkers);

    if (places.length > 0) {
      const first = new (window as any).kakao.maps.LatLng(places[0].y, places[0].x);
      kakaoMap.panTo(first);
    }
  },[kakaoMap]);

  const placesSearchCB = useCallback((data: Place[], status: string, pagination: any) => {
    const kakao = (window as any).kakao;
    if (status === kakao.maps.services.Status.OK) {
      
      if(setPlaces) setPlaces(data);
      displaySearchMarkers(data);
    } else {
      alert("검색 결과가 존재하지 않거나 오류가 발생했습니다.");
    }
  },[displaySearchMarkers]);

  return { loadKakaoMapScript, searchPlace, placesSearchCB, displaySearchMarkers };
};