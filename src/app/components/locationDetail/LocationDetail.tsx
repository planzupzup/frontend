/* eslint-disable */
"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import style from "./LocationDetail.module.scss";
import axios from "axios";
import classNames from "classnames";
import Flicking from "@egjs/react-flicking";
import { Location } from "@/app/plan/[planId]/page";

type TProps = {
    locationId: string;
    setIsShowModal: React.Dispatch<SetStateAction<boolean>>;
    isEdit?: boolean;
    day?: number;
    setTotalLocationList? : React.Dispatch<React.SetStateAction<Location[][]>>;
    locationIndex: number;
}

type TLocation = {
    scheduleOrder: string;
    locationName: string;
    category: string;
    description: string;
    googleImageUrl?: string;
    images?: string[];
}   

const LocationDetail = ({ locationId, setIsShowModal, isEdit=false, day, setTotalLocationList, locationIndex}:TProps) => {

    const [location, setLocation] = useState<TLocation | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editedDescription, setEditedDescription] = useState<string>("");

    const flickingRef = useRef<Flicking>(null);

      const easing = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;


    const goToPrev = () => {
        flickingRef.current?.prev();
    };

    const goToNext = () => {
        flickingRef.current?.next();
    };

    const loadLocation = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/location/${locationId}`);
          setLocation({scheduleOrder: response.data.result.scheduleOrder, locationName: response.data.result.locationName, category: response.data.result.category, description: response.data.result.description, googleImageUrl: response.data.result.googleImageUrl, images: ["/img_section_1_758x566.png","/img_section_3_290x290.png"]});
            setEditedDescription(response.data.result.description);
        } catch (e) {
          alert('지역을 불러오는데 실패했습니다.');
        }
      };

    useEffect(() => {
        loadLocation();
    },[]);

    const onClickSaveBtn = () => {
        if(setTotalLocationList) {
            setTotalLocationList(prevTotalLocationList => {
            const newTotalLocationList = prevTotalLocationList.map(dayLocations => [...dayLocations]);
            
            if (day !== undefined && day >= 0 && day < newTotalLocationList.length) {
                const targetLocation = { ...newTotalLocationList[day][locationIndex]};
                // 3. 복사본의 description만 수정
                targetLocation.description = editedDescription;

                // 4. 원래 위치에 수정된 새로운 객체로 교체
                newTotalLocationList[day][locationIndex] = targetLocation;
            }
            console.log(newTotalLocationList);
            return newTotalLocationList
        });}
        setIsShowModal(false);
    }

    const getTotalImageCount = () => {
        let count = 0;
        if (location?.images?.length) {
            count += location.images.length;
        }
        return count;
    };

    const totalImages = getTotalImageCount();

    return (
        <div className={style.dimmed_layer} onClick={() => {setIsShowModal(false);}}>
            <div className={style.modal} onClick={(e) => {e.stopPropagation();}}>
                <div className={style.top}>
                    <span className={style.day}>{location?.scheduleOrder}일차</span>
                    <strong className={style.title}>{location?.locationName}</strong>
                    <span className={classNames(style.category, style.type_tourist)}>{location?.category}관광명소</span>
                    <button type="button" onClick={() => {setIsShowModal(false);}} className={style.close_btn}><span className="blind">닫기</span></button>
                </div>
                <div className={style.flicking_wrap}>
                    <Flicking
                            ref={flickingRef}
                            align="prev"
                            bound={true}
                            onChanged={e => setCurrentIndex(e.index)}
                            easing={easing}
                            duration={600}
                        >
                        <div className={style.img_wrap}>
                            <img className={style.img} src={"/img_section_1_758x566.png"} alt="대표 이미지"/>
                        </div>
                        <div className={style.img_wrap}>
                            <img className={style.img} src={"/img_section_3_290x290.png"} alt="대표 이미지"/>
                        </div>
                    </Flicking>
                    { getTotalImageCount() > 1 && 
                    <><button type="button" className={style.prev_btn} onClick={goToPrev}>
                        <span className="blind">이전</span>
                    </button>
                    <button type="button" className={style.next_btn} onClick={goToNext}>
                        <span className="blind">다음</span>
                    </button></> }
                </div>
                {totalImages > 0 &&
                <div className={style.dot_wrap}>
                    {Array.from({ length: totalImages }, (_, index) => (
                        <span
                            key={index}
                            className={classNames(style.dot, { [style.is_active]: index === currentIndex })}
                        ></span>
                    ))}
                </div>
                }
                {isEdit ? <textarea className={style.textarea} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} placeholder={"사진과 함께, 이곳의 여행 이야기를 들려주세요"}></textarea> : <div className={style.desc_wrap}><p className={style.desc}>{location?.description}</p></div>}
                {isEdit && <button type="button" className={style.save_btn} onClick={onClickSaveBtn}>저장</button>}
            </div>
        </div>
    )
}

export default LocationDetail;