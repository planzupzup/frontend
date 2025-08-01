"use client";

import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "./Create.module.scss";
import { ko } from 'date-fns/locale';
import classNames from 'classnames';

const createPlan = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startCalendarMonth, setStartCalendarMonth] = useState(new Date());
    const [endCalendarMonth, setEndCalendarMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));

    const initialMonth = new Date();
    const nextMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() + 1, 1);

    const renderStartDateContents = (day:number, date:Date) => {
      if (date.getMonth() !== startCalendarMonth.getMonth()) {
          return null;
      }
      return <span>{day}</span>;
  };

  // 끝 날짜 달력의 날짜를 렌더링하는 함수
  const renderEndDateContents = (day:number, date:Date) => {
      if (date.getMonth() !== endCalendarMonth.getMonth()) {
          return null;
      }
      return <span>{day}</span>;
  };


    return (
        <div className={style.date_pick}>
          <h1 className={style.main_title}>얼마동안 떠나시나요?</h1>
          <p className={style.desc}>여행기간은 <strong className={style.color}>최대 12일</strong> 선택 가능합니다.</p>
          <div style={{ display: 'flex',justifyContent: 'center', alignItems: 'flex-start' , marginTop: '80px'}}>
            {/* 시작 날짜 선택 달력 */}
            <div className={style.calendar}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                onMonthChange={(month) => setStartCalendarMonth(month)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                monthsShown={1} // 한 번에 하나의 달만 보여줍니다.
                inline // 달력을 항상 표시합니다.
                showDisabledMonthNavigation // 비활성화된 달 탐색 버튼 표시
                minDate={initialMonth} // 현재 날짜부터 시작 (이전 날짜 선택 불가)
                renderDayContents={renderStartDateContents}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                  }) => (
                      <div className={style.custom_header_container}>
                          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                            <span className='blind'>지난달 달력보기</span>
                          </button>
                          <div>
                              {date.getFullYear()}년 {date.getMonth() + 1}월
                          </div>
                          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                            <span className='blind'>다음달 달력보기</span>
                          </button>
                      </div>
                  )}
                locale={ko}
              />
            </div>
            {/* 끝 날짜 선택 달력 */}
            <div className={style.calendar}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                onMonthChange={(month) => setEndCalendarMonth(month)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || initialMonth} // 시작 날짜 이후 또는 현재 날짜 이후부터 선택 가능
                monthsShown={1} // 한 번에 하나의 달만 보여줍니다.
                inline // 달력을 항상 표시합니다.
                showDisabledMonthNavigation // 비활성화된 달 탐색 버튼 표시
                openToDate={nextMonth} // 두 번째 달력은 첫 번째 달력의 다음 달부터 시작
                renderDayContents={renderEndDateContents}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                  }) => (
                    <div className={style.custom_header_container}>
                      <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        <span className='blind'>지난달 달력보기</span>
                      </button>
                      <div>
                          {date.getFullYear()}년 {date.getMonth() + 1}월
                      </div>
                      <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        <span className='blind'>다음달 달력보기</span>
                      </button>
                    </div>
                  )}
                locale={ko}
              />
            </div>
          </div>
          <button type="button" className={classNames(style.next_btn, {[style.is_active]: startDate && endDate})}>다음</button>
        </div>
    )
}

export default createPlan;