"use client";

import React, { ChangeEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "./Create.module.scss";
import { ko } from 'date-fns/locale';
import classNames from 'classnames';
import axios from 'axios';

const createPlan = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [inputText, setInputText] = useState("");
  const [isActivePlanTitle, setIsActivePlanTitle] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const initialMonth = new Date();

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    if (start && end && start.getTime() === end.getTime()) {
      setStartDate(null);
      setEndDate(null);
      return;
    }

    if (start && !end && startDate && endDate) {
      if (start.getTime() === startDate.getTime() || start.getTime() === endDate.getTime()) {
        setStartDate(null);
        setEndDate(null);
        return;
      }
    }
    
    setStartDate(start);
    setEndDate(end);
  };

  const renderDayContents = (day: number, date: Date) => {
    return <span>{day}</span>;
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  }

    const onClickPlanTitleNextBtn = async () => {
        if(startDate === null || endDate === null ) {
            alert("날짜 형식이 올바르지 않습니다.");
            return;
        }
        const newPlan = {
            isPublic,
            title: inputText,
            content: "내용",
            startDate: getDTODateFormat(startDate),
            endDate: getDTODateFormat(endDate),
            destinationName: "제주"
        };

  const onClickPlanTitleNextBtn = async () => {
    if (startDate === null || endDate === null) {
      alert("날짜형식이 올바르지 않습니다.");
      return;
    }

    const getDTODateFormat = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/plan`, newPlan, { withCredentials: true });
      window.location.href = `/plan/${response.data.result.planId}`;
    } catch (error) {
      console.error("Failed to create plan:", error);
    }

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        
        // 14일 초과 선택 방지
        if (start && end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 13) { // 14일 초과 선택은 14일째 되는 날 선택 가능
                alert("여행기간은 최대 14일 선택 가능합니다.");
                setStartDate(null);
                setEndDate(null);
                return;
            }
        }
        
        setStartDate(start);
        setEndDate(end);

        // 시작일과 종료일이 모두 선택된 상태에서 다시 클릭하면 시작일을 초기화
        if (startDate && endDate && start && !end) {
            setStartDate(start);
            setEndDate(null);
        }
    };
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  return (
    <div>
      <div className={classNames(style.date_pick, { [style.is_active]: isActivePlanTitle })}>
        <h1 className={style.main_title}>얼마동안 떠나시나요?</h1>
        <p className={style.desc}>여행기간은 <strong className={style.color}>최대 12일</strong> 선택 가능합니다.</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '80px', position: 'relative' }}>
          <div className={style.nav_arrow_btn_left}>
            <button
              type="button"

              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              disabled={currentMonth.getMonth() === initialMonth.getMonth() && currentMonth.getFullYear() === initialMonth.getFullYear()}
            >
              <span className='blind'>이전 달</span>
            </button>
          </div>
          {/* 시작 날짜 선택 달력 */}
          <div className={style.calendar}>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              onMonthChange={setCurrentMonth}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              monthsShown={2}
              inline // 달력을 항상 표시합니다.
              minDate={initialMonth} // 현재 날짜부터 시작 (이전 날짜 선택 불가)
              renderDayContents={renderDayContents}
              openToDate={currentMonth} // 중앙에서 제어되는 현재 월
              locale={ko}
              showPopperArrow={false}
              showMonthDropdown={false}
              showYearDropdown={false}
            />
          </div>
          <div className={style.nav_arrow_btn_right}>
            <button
              type="button"

              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            >
              <span className='blind'>다음 달</span>
            </button>
          </div>
        </div>
        <button type="button" className={classNames(style.next_btn, { [style.is_active]: startDate && endDate })} onClick={onClickDatePickNextBtn}>다음</button>
      </div>

      <div className={style.plan_title}>
        <h1 className={style.main_title}>이번 여행, 어떤 이름으로 남기고 싶나요?</h1>
        <p className={style.desc}>나만의 이름을 붙이면, 여행이 더 특별해져요</p>
        <div className={style.input_wrap}>
          <input className={style.input} type="text" placeholder="예) 엄마랑 둘이 떠나는 제주 밤바다 3박 4일" value={inputText} onChange={onChangeInput} />
          <button type="button" className={style.is_public_btn} aria-selected={!isPublic} onClick={() => setIsPublic(!isPublic)}>{isPublic ? `플랜 공개` : `플랜 비공개`}</button>
        </div>
        <button type="button" className={classNames(style.next_btn, { [style.is_active]: inputText.length > 4 })} onClick={onClickPlanTitleNextBtn}>다음</button>
      </div>
    </div>
  )
}

export default CreatePlan;