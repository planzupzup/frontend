"use client";

import React, { useEffect, useRef, useState } from 'react';
import EditSchedule from '../../components/EditSchedule';
import axios from 'axios';
import style from "@/app/plan/[planId]/Plan.module.scss";
import classNames from 'classnames';
import { useGoogleMapService } from '../../hooks/useGoogleMapService';
import { useParams } from 'next/navigation';
import LocationListEditWrapper from '@/app/components/locationList/LocationListEidtWrapper';
import LocationListWrapper from '@/app/components/locationList/LocationListWrapper';

export interface Location {
  locationId: number;
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

export interface Plan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export interface Day {
  label: string;
  value: string;
  index: string;
}

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [location, setLocation] = useState<Location>();
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('전체 일정');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polyline, setPolyline] = useState<google.maps.Polyline | google.maps.Polyline[] | null>(null);
  const [durations, setDurations] = useState<number[]>([]);
  const [totalLocationList, setTotalLocationList] = useState<Location[][]>([]); // 편집되어 저장될 수있는 원본 전체 지역 리스트
  const [originalTotalLocationList, setOriginalTotalLocationList] = useState<Location[][]>([]); // 편집되지 않은 원본 전체 지역 리스트

  const googleMapService = useGoogleMapService(mapRef, {
    googleMap,
    setGoogleMap,
    markers,
    setMarkers,
  });

  const createCustomIconWithColor = (text: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(15, 15, 12, 0, 2 * Math.PI);
      ctx.fillStyle = color;
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

  const createPolyLine = () => {
    const newMarkers: any[] = [];
    const pathCoordinates: google.maps.LatLng[] = [];
    const bounds = new window.google.maps.LatLngBounds(); 

    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4
    };

    const colorPalette = ['blue', 'green', 'orange', 'purple', 'red'];

    if (polyline) {
      if (Array.isArray(polyline)) {
        polyline.forEach((p) => p.setMap(null));
      } else {
        polyline.setMap(null);
      }
    }

    markers.forEach((marker) => marker.setMap(null));

    if(selectedDay === '전체 일정') {
      const allPaths: google.maps.LatLng[][] = [];

      totalLocationList.forEach((locationList, dayIndex) => {
        const dayPath: google.maps.LatLng[] = [];
        locationList.forEach((location, locationIndex) => {
        const latLng = new window.google.maps.LatLng(location.latitude, location.longitude);
        dayPath.push(latLng);
        bounds.extend(latLng);

        newMarkers.push(new window.google.maps.Marker({
          position: latLng,
          map: googleMap,
          icon: createCustomIconWithColor((locationIndex + 1).toString(), colorPalette[dayIndex % colorPalette.length]),
        }))
      })
      
      if (dayPath.length > 0) {
        allPaths.push(dayPath);
      }
    });

    const polylinesToSet: google.maps.Polyline[] = [];
    allPaths.forEach((path, index) => {
      if(path.length > 0 && googleMap) {
        polylinesToSet.push(
          new window.google.maps.Polyline({
            path: path,
            strokeOpacity: 0,
            icons: [
              {
                icon: { ...lineSymbol, strokeColor: colorPalette[index % colorPalette.length] }, // Polyline 색상 적용
                offset: '0',
                repeat: '20px',
              },
            ],
            map: googleMap,
          })
        )
      }
    })

    setPolyline(polylinesToSet);

    } else {
      const locationList = totalLocationList[parseInt(selectedDay, 10) - 1];
      locationList.forEach((location, locationIndex) => {
        const latLng = new window.google.maps.LatLng(location.latitude, location.longitude);
        pathCoordinates.push(latLng);
        bounds.extend(latLng);
        newMarkers.push(new window.google.maps.Marker({
          position: latLng,
          map: googleMap,
          icon: createCustomIconWithColor((locationIndex + 1).toString(), colorPalette[0]),
        }))
      })

      if(pathCoordinates.length > 0 && googleMap) {
        setPolyline(
          new window.google.maps.Polyline({
            path: pathCoordinates,
            strokeOpacity: 0,
            icons: [
              {
                icon: { ...lineSymbol, strokeColor: colorPalette[0] }, // Polyline 색상 적용
                offset: '0',
                repeat: '20px',
              },
            ],
            map: googleMap,
          })
        );
      } else {
        setPolyline(null);
      }
    }

    setMarkers(newMarkers);

    if(googleMap) {
      googleMap.fitBounds(bounds);

      const currentLocations = selectedDay === '전체 일정' ? totalLocationList.flat() : totalLocationList[parseInt(selectedDay) -1];

      if (currentLocations.length === 1) {
        googleMap.setZoom(15);
        googleMap.panTo(new window.google.maps.LatLng(currentLocations[0].latitude, currentLocations[0].longitude));
      }
    }
  }

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
    if(googleMap){
      createPolyLine();
    }
  },[totalLocationList, selectedDay]);

  useEffect(() => {
    if(totalLocationList && !isEditing) {
      setTotalLocationList(originalTotalLocationList);
    } // 편집 종료시 원본 전체 지역 리스트로 복구
  },[isEditing]);

  useEffect(() => {
    loadTotalLocationList();
  }, [days]);

  useEffect(() => {
    if (plan) {
      generateDays();
    }
  }, [plan]);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plan/${planId}`);
      setPlan(response.data.result);
    } catch (e) {
      alert('계획을 불러오는데 실패했습니다.');
    }
  };

  const loadTotalLocationList = async () => {
    try {
      var tempTotalLocationList:Location[][] = [];
      for(const [index] of days.entries()) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${planId}/${index + 1}`);
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

        tempTotalLocationList[index] = tempLocationList;
      }

      setTotalLocationList(tempTotalLocationList);
      setOriginalTotalLocationList(tempTotalLocationList);
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
        <div onClick={() => setIsEditing(prev => !prev)} className={classNames(style.item, style.type_edit)}>
          {isEditing ? '편집 종료' : '편집'}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }} className={style.contents}>
        {/* <EditSchedule day={selectedDay} planId={planId} /> */}
        <h2 className={style.title}>{plan?.title}</h2>
          <div className={style.date_wrap}>
            <p className={style.date}>{plan?.startDate} - {plan?.endDate}</p>
            <button className={style.change_date_btn} onClick={() => alert('날짜변경은 아직 구현되지 않았습니다.')}>일자변경</button>
          </div>
  
          <div className={style.schedule_wrap}>
            <h3 className={style.schedule_order}>{days.find(day => day.value === selectedDay)?.label}</h3>
            <div className={style.location_list_wrap}>
              <div className={style.location_list_area}>
                {
                  isEditing && totalLocationList ? <LocationListEditWrapper totalLocationList={selectedDay !== "전체 일정" ? [totalLocationList[parseInt(selectedDay) - 1]]: totalLocationList} setTotalLocationList={setTotalLocationList} /> :
                  <LocationListWrapper selectedDay={selectedDay} totalLocationList={totalLocationList} setLocation={setLocation} />
                }
              </div>
              <div className={style.kakao_map} ref={mapRef}></div>
            </div>
          </div>원ㄹ
      </div>
    </div>
  );
};

export default PlanDetail;
