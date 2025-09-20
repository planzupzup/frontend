/* eslint-disable */
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import style from "./CreateSearchList.module.scss";
import CreateSearchItem from "./CreateSearchItem";
import { Location } from "@/app/plan/[planId]/page";

export interface Place {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  photos: { getUrl: () => string }[];
  types: string[];
  place_id?: string;
  rating: number;
}

type TCreateSearchList = {
  setTotalLocationList: React.Dispatch<React.SetStateAction<Location[][]>>;
  selectedDay: string;
  totalLocationList: Location[][];
};

const CreateNoPlan = () => {
  return (
    <div className={style.no_plan}>
      <h2 className={style.title}>아직 플랜이 없어요</h2>
      <p className={style.desc}>가고 싶은 곳을 적고 첫 플랜을 만들어보세요!</p>
    </div>
  );
};

const CreateSearchList = ({ setTotalLocationList, selectedDay, totalLocationList }: TCreateSearchList) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const onChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchInput(keyword);

    if (!keyword) {
      setPlaces([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?keyword=${keyword}`);
      if (!res.ok) {
        console.error("Search API proxy error:", await res.text());
        setPlaces([]);
        return;
      }

      const data = await res.json();

      if (data.response?.body?.totalCount > 0) {
        const items = data.response.body.items.item;
        const results = Array.isArray(items) ? items : [items];

        const newPlaces: Place[] = results.map((item: any) => ({
          name: item.title,
          formatted_address: item.addr1,
          geometry: {
            location: {
              lat: () => parseFloat(item.mapy),
              lng: () => parseFloat(item.mapx),
            },
          },
          rating: 0,
          types: item.contenttypeid ? [item.contenttypeid.toString()] : [],
          photos: (item.firstimage || item.firstimage2)
            ? [
                {
                  getUrl: () => (item.firstimage || item.firstimage2) as string,
                },
              ]
            : [],
          place_id: item.contentid,
        }));
        setPlaces(newPlaces);
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.error("Failed to fetch places:", error);
      setPlaces([]);
    }
  };

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
                        <CreateSearchItem key={place.place_id} place={place} searchInput={searchInput} addSearchItem={addSearchItem} selectedDay={selectedDay} searchItemIndex={index}/>
                    )) : <CreateNoPlan />
                }
            </ul>
        </div>
    )
};

export default CreateSearchList;