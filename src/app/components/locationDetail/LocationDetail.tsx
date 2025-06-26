/* eslint-disable */
"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import style from "./LocationDetail.module.scss";
import axios from "axios";
import classNames from "classnames";
import Flicking from "@egjs/react-flicking";

type TProps = {
    locationId: string;
    setIsShowModal: React.Dispatch<SetStateAction<boolean>>;
}

type TLocation = {
    scheduleOrder: string;
    locationName: string;
    category: string;
    description: string;
    googleImageUrl?: string;
    images?: string[];
}   

const LocationDetail = ({ locationId, setIsShowModal}:TProps) => {

    const [location, setLocation] = useState<TLocation | null>(null);

    const flickingRef = useRef<Flicking>(null);

    const goToPrev = () => {
        flickingRef.current?.prev();
    };

    const goToNext = () => {
        flickingRef.current?.next();
    };

    const loadLocation = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${locationId}`);
          console.log(response.data.result.locationName);
          setLocation({scheduleOrder: response.data.result.scheduleOrder, locationName: response.data.result.locationName, category: response.data.result.category, description: response.data.result.description, googleImageUrl: response.data.result.googleImageUrl, images: ["/img_section_1_758x566.png","/img_section_3_290x290.png"]});
        } catch (e) {
          alert('지역을 불러오는데 실패했습니다.');
        }
      };

    useEffect(() => {
        loadLocation();
    },[]);

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
                            onChanged={e => console.log(e.index)}
                        >
                        {location?.googleImageUrl && (
                                <div className={style.img_wrap}>
                                    <img className={style.img} src={location.googleImageUrl} alt="대표 이미지"/>
                                </div>
                            )}
                        {location?.images?.map((image, index) => (
                            <div className={style.img_wrap} key={index}>
                                <img className={style.img} src={image} alt={`이미지 ${index + 1}`}/>
                            </div>
                        ))}

                    </Flicking>
                    { location?.images?.length && location?.images?.length > 1 && <><button type="button" className={style.prev_btn} onClick={goToPrev}>
                        <span className="blind">이전</span>
                    </button>
                    <button type="button" className={style.next_btn} onClick={goToNext}>
                        <span className="blind">다음</span>
                    </button> </> }
                </div>
                <p className={style.desc}>
                    {location?.description}
                </p>
                <button type="button" className={style.save_btn}>저장</button>
            </div>
        </div>
    )
}

export default LocationDetail;