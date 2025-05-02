"use client";

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import style from "./EditSchedule.module.scss";
import { useKakaoMapService } from '../hooks/useKakaoMapService';

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

  const kakaoMapService = useKakaoMapService(mapRef, {
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
  })

  useEffect(() => {
    kakaoMapService.loadKakaoMapScript();
  }, []);

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
          onKeyDown={(e) => e.key === 'Enter' && kakaoMapService.searchPlace()}
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