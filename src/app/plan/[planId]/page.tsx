"use client";

import React, { useEffect, useRef, useState } from 'react';
import EditSchedule from '../../components/EditSchedule';
import axios from 'axios';
import style from "./Plan.module.scss";
import classNames from 'classnames';
import { useGoogleMapService } from '../../hooks/useGoogleMapService';
import { useParams } from 'next/navigation';
import { getTimeUnit } from '@/app/utils/getTimeUnit';

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
  address: string;
  duration: number;
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
  index: string;
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
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const [durations, setDurations] = useState<number[]>([]);

  const googleMapService = useGoogleMapService(mapRef, {
    googleMap,
    setGoogleMap,
    markers,
    setMarkers,
  });

  const createCustomIcon = (text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(15, 15, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 15, 15);
    }
    return {
      url: canvas.toDataURL(),
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: new window.google.maps.Point(15, 15),
    };
  };

  useEffect(() => {
    if(mapRef.current){
      googleMapService.loadGoogleMapScript();
    }
  },[mapRef]);

  useEffect(() => {
    if(location && googleMap) {
      const lat = location.latitude;
      const lng = location.longitude;
  
      googleMap.panTo({ lat, lng });
    }
  },[location]);

  useEffect(() => {
    if(googleMap && locationList.length > 0) {
      const newMarkers: any[] = [];
      const pathCoordinates: google.maps.LatLng[] = [];
      const bounds = new window.google.maps.LatLngBounds(); 

      locationList.forEach((location) => {
        const latLng = new window.google.maps.LatLng(location.latitude, location.longitude);
        pathCoordinates.push(latLng);
        bounds.extend(latLng);
        newMarkers.push(new window.google.maps.Marker({
          position: latLng,
          map: googleMap,
          icon: createCustomIcon(location.scheduleOrder.toString()),
        }))
      })

      if(polyline) polyline.setMap(null);
      markers.forEach((marker) => marker.setMap(null));

      setMarkers(newMarkers);

      var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 4
      };

      setPolyline(new window.google.maps.Polyline({
        path: pathCoordinates,
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
        map: googleMap,
      }));

      googleMap.fitBounds(bounds);

      if (locationList.length === 1) {
        googleMap.setZoom(15); // 적절한 줌 레벨 설정
        googleMap.panTo(pathCoordinates[0]); // 첫 번째 (유일한) 위치로 이동
      }
    }
  }, [googleMap,locationList]);

  useEffect(() => {
    loadLocationList();
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
      if(selectedDay !== '전체 일정') {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${planId}/${selectedDay}`);
        var tempLocationList = response.data.result;

        var tempLocation: {lat: number; lng: number} | null = null;
    
        for(const [index, location] of tempLocationList.entries()) {
          if(index == 0) {
            tempLocation = {lat: location.latitude, lng: location.longitude};
            location.duration = 0;
            continue;
          }
    
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/google/direction?origin=${tempLocation?.lat},${tempLocation?.lng}&destination=${location.latitude},${location.longitude}&mode=transit`
            );
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            tempLocation = {lat: location.latitude, lng: location.longitude};
            location.duration = data.routes[0].legs[0].duration.value;
          } catch(e) {
            console.error(e);
            return [] ;
          }
        }

        setLocationList(tempLocationList);
      }
    } catch (e) {
      alert('일정 정보를 불러오는데 실패했습니다.');
    }
  };

  const generateDays = () => {
    if (!plan) return;
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const result: Day[] = [];
    let index = 1;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      result.push({
        label: `${index}일차`,
        value: date.toISOString().split('T')[0],
        index: `${index}`
      });
      index++;
    }

    setDays(result);
  };

  return (
    <div style={{ display: 'flex' }} className={style.list_wrap}>
      {/* Sidebar */}
      <div style={{ width: '200px' }} className={style.list}>
        <div onClick={() => setSelectedDay('전체 일정')} style={{ fontWeight: selectedDay === '전체 일정' ? 'bold' : 'normal' }} className={style.item}>
          전체 일정
        </div>
        <div className={style.scroll_area}>
          {days.map(day => (
            <div key={day.value} onClick={() => {setSelectedDay(day.index); }} style={{ fontWeight: selectedDay === day.index ? 'bold' : 'normal' }} className={style.item}>
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
        {/* [D] 편집모드<EditSchedule day={selectedDay} planId={planId} /> */ } 
        <h2 className={style.title}>{plan?.title}</h2>
        <div className={style.date_wrap}>
          <p className={style.date}>{plan?.startDate} - {plan?.endDate}</p>
          <button className={style.change_date_btn} onClick={() => alert('날짜변경은 아직 구현되지 않았습니다.')}>일자변경</button>
        </div>

        <div className={style.schedule_wrap}>
            <h3 className={style.schedule_order}>{days.find(day => day.value === selectedDay)?.label}</h3>
            <div className={style.location_list_wrap}>
              <div className={style.location_list}>
                {locationList.map((location, idx) => (
                  <>
                    {idx>0 && <div className={style.duration}>{getTimeUnit(location.duration)}</div>}
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
                  </>
                ))}
              </div>
              <div className={style.kakao_map} ref={mapRef}></div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PlanDetail;
