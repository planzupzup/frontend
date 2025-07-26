// googleMapService.ts
/* eslint-disable */
import { useCallback, useEffect } from "react";

export interface Place {
  name: string;
  formatted_address: string;
  geometry: {
    location: google.maps.LatLng; // 또는 google.maps.LatLngLiteral
  };
  photos: google.maps.places.PlacePhoto[];
  types: string[];
  place_id?: string;
  rating: number;
}

interface GoogleMapState {
  googleMap?: google.maps.Map | null;
  placesService?: google.maps.places.PlacesService | null;
  markers?: google.maps.Marker[];
  setGoogleMap?: (map: google.maps.Map | null) => void;
  setPlacesService?: (service: google.maps.places.PlacesService | null) => void;
  setMarkers?: (markers: google.maps.Marker[]) => void;
  searchInput?: string;
  setSearchInput?: (input: string) => void;
  places?: Place[];
  setPlaces?: (places: Place[]) => void;
}

export const useGoogleMapService = (
  state?: GoogleMapState,
  mapRef?: React.RefObject<HTMLDivElement | null>
) => {
  if(!state) return;
  
  const {
    googleMap,
    setGoogleMap,
    placesService,
    setPlacesService,
    markers,
    setMarkers,
    searchInput,
    places,
    setPlaces,
  } = state;

  const loadGoogleMapScript = useCallback((latitude?: number, longitude?: number) => {
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

    if (!googleApiKey) {
      console.error("❌ Google Map API Key가 설정되지 않았습니다.");
      return;
    }

    // 기존 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );
    if (existingScript) {
      console.warn("⚠️ 기존 Google 스크립트가 이미 있습니다. 제거 후 재삽입합니다.");
      existingScript.remove();
    }

    // 스크립트 생성
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    // 성공 시
    script.onload = () => {
      console.log("✅ Google Map 스크립트 로드 완료");
      if (window.google && window.google.maps&& mapRef) {
        console.log("✅ Google Map API 로딩 완료");

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
          center: { lat: centerLat, lng: centerLng },
          zoom: 15, // 초기 줌 레벨
        };

        const map = new window.google.maps.Map(container, options);
        if(setGoogleMap) setGoogleMap(map);

        const service = new window.google.maps.places.PlacesService(map);
        if(setPlacesService) setPlacesService(service);
        console.log("✅ 지도 및 장소 서비스 초기화 완료");

        if (latitude && longitude) {
          const initialMarker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
          });
          if(setMarkers) setMarkers([initialMarker]);
          map.panTo({ lat: latitude, lng: longitude });
        }
      } else {
        console.error("❌ window.google 또는 google.maps가 존재하지 않습니다.");
      }
    };

    // 실패 시
    script.onerror = () => {
      console.error("❌ Google Map 스크립트 로드 실패");
    };

    document.head.appendChild(script);
  },[]);

  const searchPlace = () => {
    console.log(placesService);
    console.log(searchInput);
    if (placesService && searchInput) {
      console.log("@");
      const request = {
        query: searchInput,
        fields: ["name", "geometry", "formatted_address", "photos", "types", "rating"],
        language: 'ko',
      };

      placesService.textSearch(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            if (setPlaces) {
              setPlaces(results as Place[]);
            }
          } else {
            alert(
              "검색 결과가 존재하지 않거나 오류가 발생했습니다: " + status
            );
          }
        }
      );
    }
  };

  const displaySearchResults = useCallback(
    () => {
      if (!googleMap) return;
      if(markers && setMarkers) {
        markers.forEach((marker) => marker.setMap(null));
        if(places) {
          const newMarkers: google.maps.Marker[] = places.map((place) => {
            const marker = new window.google.maps.Marker({
              map: googleMap,
              position: place.geometry.location,
            });
            return marker;
          });
          setMarkers(newMarkers);

          if (places.length > 0) {
            googleMap.panTo(places[0].geometry.location);
          }
        }
      }
      
    },
    [googleMap, places]
  );

  useEffect(() => {
    if(places && places.length > 0) {
      displaySearchResults();
    }
  }, [places])

  return { loadGoogleMapScript, searchPlace, displaySearchResults };
};