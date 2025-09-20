/* eslint-disable */
"use client";

import { ChangeEvent, RefObject, forwardRef, useEffect, useState } from "react";
import style from "./CreateSearchList.module.scss";
import CreateSearchItem from "./CreateSearchItem";
import { Place, useGoogleMapService } from "@/app/hooks/useGoogleMapService";
import { Location } from "@/app/plan/[planId]/page";

type TCreateSearchList = {
  googleMap: google.maps.Map | null;
  setGoogleMap: (map: google.maps.Map | null) => void;
  mapRef: RefObject<HTMLDivElement | null> | undefined;
  placesService: any;
  setPlacesService: any;
  setTotalLocationList : React.Dispatch<React.SetStateAction<Location[][]>>;
  selectedDay: string;
  totalLocationList : Location[][];
}

const CreateNoPlan = () => {
  return (
    <div className={style.no_plan}>
      <h2 className={style.title}>아직 플랜이 없어요</h2>
      <p className={style.desc}>가고 싶은 곳을 적고 첫 플랜을 만들어보세요!</p>
    </div>
  )
}

const CreateSearchList = ({googleMap, setGoogleMap, placesService, setPlacesService, mapRef, setTotalLocationList, selectedDay, totalLocationList}:TCreateSearchList ) => {

  const [places, setPlaces] = useState<Place[]>([]);
  const [searchInput, setSearchInput] = useState('');

  const googleMapService = useGoogleMapService({
    googleMap,
    setGoogleMap,
    placesService,
    setPlacesService,
    setSearchInput,
    places,
    setPlaces,
  }, mapRef);

  const onChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchInput(keyword);

    if (!keyword) {
      setPlaces([]);
      return;
    }

    googleMapService?.searchPlace(keyword);

    // try {
    //   const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/place/2?keyword=${keyword}`);
    //   const data = await res.json();
      
    //   if (data.content) {
    //     const newPlaces: Place[] = data.content.map((item: any) => ({
    //       name: item.name,
    //       formatted_address: item.formatted_address,
    //       geometry: {
    //         location: new google.maps.LatLng(item.latitude, item.longitude),
    //       },
    //       rating: item.rating || 0,
    //       types: item.types || [],
    //       photos: item.photoUrl ? [{
    //         getUrl: () => item.photoUrl,
    //         height: 500,
    //         width: 500,
    //         html_attributions: [''],
    //       }] as google.maps.places.PlacePhoto[] : [],
    //       place_id: item.place_id,
    //     }));
    //     setPlaces(newPlaces);
    //   }
    // } catch (error) {
    //   console.error("Failed to fetch places:", error);
    //   setPlaces([]);
    // }
  }

  const addSearchItem = (location: Location) => {
    const dayIndex = parseInt(selectedDay, 10) - 1;

    setTotalLocationList(prevTotalLocationList => {
      const newTotalLocationList = prevTotalLocationList.map(dayLocations => [...dayLocations]);

      if (dayIndex >= 0 && dayIndex < newTotalLocationList.length) {
        newTotalLocationList[dayIndex].push(location);
      } else {
        console.warn(`[addSearchItem] 유효하지 않은 dayIndex에 위치를 추가하려고 시도했습니다: ${dayIndex}. 현재 totalLocationList의 길이: ${newTotalLocationList.length}.`);
      }
      return newTotalLocationList
    });
  };

  useEffect(() => {
    setSearchInput("");
  },[selectedDay]);

  const isFirst = (totalLocationList: Location[][]) => {
    return totalLocationList.every(location => location.length === 0);
  }

    return (
        <div className={style.create_search_wrap}>
            <div className={style.search_wrap}>
                <input type="text"
                  value={searchInput}
                  onChange={onChangeInput}
                  className={style.search_input}
                  placeholder="상호명 또는 주소를 입력하세요"/>
            </div>
            <ul className={style.list}>
                {
                    totalLocationList[parseInt(selectedDay, 10) - 1].length > 0 || searchInput.length > 0 ? places.map((place, index) => (
                        <CreateSearchItem place={place} searchInput={searchInput} addSearchItem={addSearchItem} selectedDay={selectedDay} searchItemIndex={index}/>
                    )) : <CreateNoPlan />
                }
            </ul>
        </div>
    )
};

export default CreateSearchList;