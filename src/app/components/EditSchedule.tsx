"use client";

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import style from "./EditSchedule.module.scss";

interface Place {
  place_name: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface Location {
  locationId: number;
  scheduleOrder: number;
  locationName: string;
  category: string;
}

interface Props {
  day: string; // format 'YYYY-MM-DD'
  planId: string;
  onSave: (locations: Location[]) => void;
}

const EditSchedule: React.FC<Props> = ({ day, planId, onSave }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("카페");

  useEffect(() => {
    loadKakaoMapScript();
  }, []);

  const loadKakaoMapScript = () => {
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
  
          const options = {
            center: new (window as any).kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          const map = new (window as any).kakao.maps.Map(container, options);
          const places = new (window as any).kakao.maps.services.Places();
  
          setKakaoMap(map);
          setPlacesService(places);
          console.log("✅ 지도 및 장소 서비스 초기화 완료");
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

  const placesSearchCB = (data: Place[], status: string, pagination: any) => {
    const kakao = (window as any).kakao;
    if (status === kakao.maps.services.Status.OK) {
      setPlaces(data);
      displayMarkers(data);
    } else {
      alert("검색 결과가 존재하지 않거나 오류가 발생했습니다.");
    }
  };

  const displayMarkers = (places: Place[]) => {
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const selectLocation = (place: Place) => {
    if (!kakaoMap) return;
    setSelectedLocation(place);
    setSearchInput(place.place_name);
    setPlaces([]);
    const position = new (window as any).kakao.maps.LatLng(place.y, place.x);
    kakaoMap.panTo(position);
  };

  const addLocation = async () => {
    if (!selectedLocation) return;

    const dto = {
      latitude: selectedLocation.y,
      longitude: selectedLocation.x,
      address: selectedLocation.address_name,
      day,
      scheduleOrder: locations.length + 1,
      category,
      locationName: selectedLocation.place_name,
      planId,
    };

    const formData = new FormData();
    formData.append("locationCreateReqDto", new Blob([JSON.stringify(dto)], { type: "application/json" }));
    if (file) formData.append("file", file);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedLocation(null);
      setSearchInput('');
      setFile(null);
      loadLocations();
    } catch (error: any) {
      alert('위치등록에 실패했습니다.');
      console.error(error);
    }
  };

  const loadLocations = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${planId}/${day}`);
      setLocations(res.data.result);
    } catch (error: any) {
      alert('위치 불러오기 실패');
      console.error(error);
    }
  };

  return (
    <div className={style.locationSelectorContainer}>
      <div className={style.leftPanel}>
        <div className={style.addLocationTitle}>장소 추가</div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchPlace()}
          className={style.searchInput}
          placeholder="상호명 또는 주소를 입력하세요"
        />
        <div ref={mapRef} className={style.mapBox} />
        <ul className={style.placesList}>
          {places.map((place, idx) => (
            <li key={idx} className={style.placeItem} onClick={() => selectLocation(place)}>
              <strong>{place.place_name}</strong>
              <div className={style.addressText}>
                {place.road_address_name || place.address_name}
              </div>
            </li>
          ))}
        </ul>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={style.categorySelect}>
          <option value="카페">카페</option>
          <option value="식당">식당</option>
          <option value="관광명소">관광명소</option>
        </select>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <div className={style.addButton} onClick={addLocation}>추가</div>
      </div>
      <div className={style.rightPanel}>
        {locations.map(loc => (
          <div key={loc.locationId} className={style.locationBox}>
            <div className={style.orderCircle}>{loc.scheduleOrder}</div>
            <div className={style.locationName}>{loc.locationName}</div>
            <div className={style.locationCategory}>{loc.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditSchedule;