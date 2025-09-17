"use client";

import React, { ChangeEvent, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import style from "./Create.module.scss";
import { ko } from 'date-fns/locale';
import classNames from 'classnames';
import axios from 'axios';

const CreatePlan = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [inputText, setInputText] = useState("");
    const [isActivePlanTitle, setIsActivePlanTitle] = useState(false);
    const [isPublic, setIsPublic] = useState(true);

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    }

    const onClickDatePickNextBtn = () => {
      if (startDate && endDate) {
          setIsActivePlanTitle(true);
      } else {
          alert("날짜를 선택해주세요.");
      }
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

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/plan`, newPlan, { withCredentials: true });
            window.location.href = `/plan/${response.data.result.planId}`;
        } catch (error) {
            console.error("Failed to create plan:", error);
        }
    }

    const getDTODateFormat = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
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

    return (
        <div>
          <div className={classNames(style.date_pick, {[style.is_active]: isActivePlanTitle})}>
            <h1 className={style.main_title}>얼마동안 떠나시나요?</h1>
            <p className={style.desc}>여행기간은 <strong className={style.color}>최대 14일</strong> 선택 가능합니다.</p>
            <div className={style.calendar_container}>
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={2}
                minDate={new Date()}
                locale={ko}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => {
                    return (
                      <div className={style.custom_header_container}>
                          <button
                            onClick={() => {
                                decreaseMonth(); // 한 달 감소
                                decreaseMonth(); // 한 달 더 감소 (총 두 달 감소)
                            }}
                            disabled={prevMonthButtonDisabled}
                          >
                            <span className='blind'>이전 2개월</span>
                          </button>
                          <div>
                              {date.getFullYear()}년 {date.getMonth() + 1}월
                          </div>
                          <button
                            onClick={() => {
                                increaseMonth(); // 한 달 증가
                                increaseMonth(); // 한 달 더 증가 (총 두 달 증가)
                            }}
                            disabled={nextMonthButtonDisabled}
                          >
                            <span className='blind'>다음 2개월</span>
                          </button>
                      </div>
                    );
                }}
              />
            </div>
            <button
                type="button"
                className={classNames(style.next_btn, { [style.is_active]: startDate && endDate })}
                onClick={onClickDatePickNextBtn}
            >
                다음
            </button>
          </div>

          <div className={classNames(style.plan_title, {[style.is_active]: isActivePlanTitle})}>
            <h1 className={style.main_title}>이번 여행, 어떤 이름으로 남기고 싶나요?</h1>
            <p className={style.desc}>나만의 이름을 붙이면, 여행이 더 특별해져요</p>
            <div className={style.input_wrap}>
              <input className={style.input} type="text" placeholder="예) 엄마랑 둘이 떠나는 제주 밤바다 3박 4일" value={inputText} onChange={onChangeInput}/>
              <button type="button" className={style.is_public_btn} aria-selected={!isPublic} onClick={() => setIsPublic(!isPublic)}>{ isPublic ? `플랜 공개` : `플랜 비공개`}</button>
            </div>
            <button
                type="button"
                className={classNames(style.next_btn, { [style.is_active]: inputText.length > 4 })}
                onClick={onClickPlanTitleNextBtn}
            >
                다음
            </button>
          </div>
        </div>
    )
}

export default CreatePlan;