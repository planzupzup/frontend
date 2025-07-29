"use client";

import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "./Create.module.scss";

const createPlan = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const initialMonth = new Date();
    const nextMonth = new Date(initialMonth.getFullYear(), initialMonth.getMonth() + 1, 1);

    return (
        <div className={style.date_pick}>
            <h1 className={style.main_title}>얼마동안 떠나시나요?</h1>
        <p className={style.desc}>여행기간은 <strong className={style.color}>최대 12일</strong> 선택 가능합니다.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
      {/* 시작 날짜 선택 달력 */}
      <div>
        <h3>시작 날짜</h3>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          monthsShown={1} // 한 번에 하나의 달만 보여줍니다.
          inline // 달력을 항상 표시합니다.
          showDisabledMonthNavigation // 비활성화된 달 탐색 버튼 표시
          minDate={initialMonth} // 현재 날짜부터 시작 (이전 날짜 선택 불가)
        />
      </div>

      {/* 끝 날짜 선택 달력 */}
      <div>
        <h3>끝 날짜</h3>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate || initialMonth} // 시작 날짜 이후 또는 현재 날짜 이후부터 선택 가능
          monthsShown={1} // 한 번에 하나의 달만 보여줍니다.
          inline // 달력을 항상 표시합니다.
          showDisabledMonthNavigation // 비활성화된 달 탐색 버튼 표시
          openToDate={nextMonth} // 두 번째 달력은 첫 번째 달력의 다음 달부터 시작
        />
      </div>

      {/* 선택된 날짜 표시 */}
      <div style={{ marginLeft: '30px' }}>
        <h3>선택된 날짜</h3>
        <p>시작 날짜: {startDate ? startDate.toLocaleDateString('ko-KR') : '선택 안됨'}</p>
        <p>끝 날짜: {endDate ? endDate.toLocaleDateString('ko-KR') : '선택 안됨'}</p>
      </div>
    </div>
        </div>
    )
}

export default createPlan;