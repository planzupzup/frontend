/* eslint-disable */
"use client";

import { RefObject, forwardRef, useEffect, useState } from "react";
import style from "./CreateSearchList.module.scss";
import CreateSearchItem from "./CreateSearchItem";
import { Place, useGoogleMapService } from "@/app/hooks/useGoogleMapService";

type TCreateSearchList = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map | null) => void;
  mapRef: RefObject<HTMLDivElement | null> | undefined;
  placesService: any;
  setPlacesService: any;
}

const CreateSearchList = ({googleMap, setGoogleMap, placesService, setPlacesService, mapRef}:TCreateSearchList ) => {

  const [places, setPlaces] = useState<Place[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const googleMapService = useGoogleMapService({
    googleMap,
    setGoogleMap,
    placesService,
    setPlacesService,
    searchInput,
    setSearchInput,
    places,
    setPlaces,
  }, mapRef);

  useEffect(()=> {
    console.log(places);
  },[places]);

    return (
        <div className={style.create_search_wrap}>
            <div className={style.date_wrap}>
                <span className={style.day}>1일차</span>
                <span className={style.destination}>부산</span>
                <span className={style.date}>2025/05/27</span>
            </div>
            <div className={style.search_wrap}>
                <input type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && googleMapService?.searchPlace()}
                  className={style.searchInput}
                  placeholder="상호명 또는 주소를 입력하세요"/>
            </div>
            <ul className={style.list}>
                {
                    places.map((place) => (
                        <CreateSearchItem place={place} />
                    ))
                }
            </ul>
        </div>
    )
};

export default CreateSearchList;

/*
"use client";

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import style from "./EditSchedule.module.scss";
import { useGoogleMapService } from '../hooks/useGoogleMapService';
import { Place } from '../hooks/useGoogleMapService';
import { getKoreanCategory } from '../utils/getKoreanCategory';

interface Location {
  locationId: number;
  scheduleOrder: number;
  locationName: string;
  category: string;
}

interface Props {
  day?: string; // format 'YYYY-MM-DD'
  planId?: string;
  onSave?: (locations: Location[]) => void;
}
/* eslint-disable */
/*
const EditSchedule: React.FC<Props> = ({ day, planId, onSave }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("카페");

  const kakaoMapService = useGoogleMapService(mapRef, {
    googleMap,
    setGoogleMap,
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
    if(mapRef.current){
      kakaoMapService.loadGoogleMapScript();
    }
  }, [mapRef]);

  useEffect(() => {
    console.log(places);
  },[places]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const selectLocation = (place: Place) => {
    if (!googleMap) return;
    setSelectedLocation(place);
    setSearchInput(place.name);

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();


    markers.forEach((marker) => marker.setMap(null));

    setMarkers([new window.google.maps.Marker({
      position: { lat, lng },
      map: googleMap,
    })]);

    googleMap.panTo({ lat, lng });
  };

  const addLocation = async () => {
    if (!selectedLocation) return;

    const dto = {
      latitude: selectedLocation.geometry.location.lat(),
      longitude: selectedLocation.geometry.location.lng(),
      address: selectedLocation.formatted_address,
      day,
      scheduleOrder: locations.length + 1,
      category,
      locationName: selectedLocation.name,
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
    } catch (error: any) {
      alert('위치등록에 실패했습니다.');
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
              <div>
                <strong>{place.name}</strong>
                <div className={style.addressText}>
                  {place.formatted_address}
                </div>
              </div>
              <div className={style.img_wrap}>
                {place.photos && place.photos.length > 0 && place.photos[0].getUrl() ? (
                  <img src={place.photos[0].getUrl()} className={style.img} alt={place.name} />
                ) : (
                  <div className={style.noImage}>No Image</div>
                )}
              </div>
              <div>
              {getKoreanCategory(place.types)}
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

export default EditSchedule; */