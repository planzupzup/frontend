"use client";

import React, { useEffect, useRef, useState } from 'react';
import EditSchedule from '../../components/EditSchedule';
import axios from 'axios';
import style from "./Plan.module.scss";
import classNames from 'classnames';
import { useKakaoMapService } from '../../hooks/useKakaoMapService';
import { useParams } from 'next/navigation';
import useDidMountEffect from '../../hooks/useDidMountEffect';

interface Location {
  id: number;
  locationName: string;
  category: string;
  scheduleOrder: number;
  day: string;
  image?: {
    imageId: number,
    imageUrl: string
  }
  latitude: number;
  longitude: number;
}

interface Plan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}

interface Day {
  label: string;
  value: string;
}

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [location, setLocation] = useState<Location>();
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('전체 일정');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const kakaoMapService = useKakaoMapService(mapRef, {
    kakaoMap,
    setKakaoMap,
    markers,
    setMarkers,
  });

  useDidMountEffect(() => {
    kakaoMapService.loadKakaoMapScript();
  },[location]);

  useEffect(() => {
    loadLocationList();
    console.log(selectedDay);
    if(locationList.length > 0) setLocation(locationList[0]);
  },[selectedDay]);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  useEffect(() => {
    if (plan) generateDays();
  }, [plan]);

  const loadPlan = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plan/${planId}`);
      setPlan(response.data.result);
    } catch (e) {
      alert('계획을 불러오는데 실패했습니다.');
    }
  };

  const loadLocationList = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${planId}`);
      setLocationList(response.data.result);
    } catch (e) {
      alert('일정 정보를 불러오는데 실패했습니다.');
    }
  };

  const generateDays = () => {
    if (!plan) return;
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const result: Day[] = [];
    let dayIndex = 1;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      result.push({
        label: `${dayIndex}일차`,
        value: date.toISOString().split('T')[0],
      });
      dayIndex++;
    }

    setDays(result);
  };

  const getLocationsForDay = (day: string) => locationList.filter(location => location.day === day);

  return (
    <div style={{ display: 'flex' }} className={style.list_wrap}>
      {/* Sidebar */}
      <div style={{ width: '200px' }} className={style.list}>
        <div onClick={() => setSelectedDay('전체 일정')} style={{ fontWeight: selectedDay === '전체 일정' ? 'bold' : 'normal' }} className={style.item}>
          전체 일정
        </div>
        <div className={style.scroll_area}>
          {days.map(day => (
            <div key={day.value} onClick={() => {setSelectedDay(day.value); }} style={{ fontWeight: selectedDay === day.value ? 'bold' : 'normal' }} className={style.item}>
              {day.label}
            </div>
          ))}
        </div>
        {selectedDay !== '전체 일정' && (
          <div onClick={() => setIsEditing(prev => !prev)} className={classNames(style.item, style.type_edit)}>
            {isEditing ? '편집 종료' : '편집'}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }} className={style.contents}>
        <h2 className={style.title}>{plan?.title}</h2>
        <div className={style.date_wrap}>
          <p className={style.date}>{plan?.startDate} - {plan?.endDate}</p>
          <button className={style.change_date_btn} onClick={() => alert('날짜변경은 아직 구현되지 않았습니다.')}>일자변경</button>
        </div>

        {selectedDay === '전체 일정' ? (
          <EditSchedule day={selectedDay} planId={planId!} onSave={() => loadLocationList()} />
        ) : isEditing ? (
          <EditSchedule day={selectedDay} planId={planId!} onSave={() => loadLocationList()} />
        ) : (
          <div className={style.schedule_wrap}>
            <h3 className={style.schedule_order}>{days.find(day => day.value === selectedDay)?.label}</h3>
            <div className={style.location_list_wrap}>
              <div className={style.location_list}>
                {getLocationsForDay(selectedDay).map(location => (
                  <div key={location.id} className={style.location_item} onClick={() => setLocation(location)}>
                    <div className={style.order}>{location.scheduleOrder}</div>
                    <div className={style.name_wrap}>
                      <div className={style.name}>{location.locationName}</div>
                      <div className={style.category}>{location.category}</div>
                    </div>
                    <div className={style.img_wrap}>
                      <img src={location.image?.imageUrl} className={style.img}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className={style.kakao_map} ref={mapRef}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetail;
