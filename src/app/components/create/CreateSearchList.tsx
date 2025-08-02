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

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    googleMapService?.searchPlace(e.target.value);
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
                    totalLocationList[parseInt(selectedDay, 10) - 1].length > 0 ? places.map((place, index) => (
                        <CreateSearchItem place={place} searchInput={searchInput} addSearchItem={addSearchItem} selectedDay={selectedDay} searchItemIndex={index}/>
                    )) : <CreateNoPlan />
                }
            </ul>
        </div>
    )
};

export default CreateSearchList;
