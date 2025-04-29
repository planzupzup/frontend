"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditSchedule from '../components/EditSchedule';
import axios from 'axios';

interface Location {
  id: number;
  locationName: string;
  category: string;
  scheduleOrder: number;
  day: string;
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
  const planId = "3";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('전체 일정');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    loadPlan();
    loadLocationList();
  }, [planId]);

  useEffect(() => {
    if (plan) generateDays();
  }, [plan]);

  const loadPlan = async () => {
    try {
      const response = await axios.get(`api/plan/${planId}`);
      setPlan(response.data.result);
    } catch (e) {
      alert('계획을 불러오는데 실패했습니다.');
    }
  };

  const loadLocationList = async () => {
    try {
      const response = await axios.get(`api/location/${planId}`);
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

  const getLocationsForDay = (day: string) =>
    locationList.filter(location => location.day === day);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '200px' }}>
        <div onClick={() => setSelectedDay('전체 일정')} style={{ fontWeight: selectedDay === '전체 일정' ? 'bold' : 'normal' }}>
          전체 일정
        </div>
        {days.map(day => (
          <div key={day.value} onClick={() => setSelectedDay(day.value)} style={{ fontWeight: selectedDay === day.value ? 'bold' : 'normal' }}>
            {day.label}
          </div>
        ))}
        {selectedDay !== '전체 일정' && (
          <div onClick={() => setIsEditing(prev => !prev)}>
            {isEditing ? '편집 종료' : '편집'}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '30px', flex: 1 }}>
        <h2>{plan?.title}</h2>
        <p>{plan?.startDate} - {plan?.endDate}</p>
        <button onClick={() => alert('날짜변경은 아직 구현되지 않았습니다.')}>일자변경</button>

        {selectedDay === '전체 일정' ? (
          <EditSchedule day={selectedDay} planId={planId!} onSave={() => loadLocationList()} />
        ) : isEditing ? (
          <EditSchedule day={selectedDay} planId={planId!} onSave={() => loadLocationList()} />
        ) : (
          <div>
            <h3>{days.find(day => day.value === selectedDay)?.label}</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              {getLocationsForDay(selectedDay).map(location => (
                <div key={location.id}>
                  <div>{location.scheduleOrder}</div>
                  <div>{location.locationName}</div>
                  <div>{location.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetail;
