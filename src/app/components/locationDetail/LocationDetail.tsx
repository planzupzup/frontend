/* eslint-disable */
"use client";

import { SetStateAction, useEffect, useState } from "react";
import style from "./LocationDetail.module.scss";
import axios from "axios";
import classNames from "classnames";

type TProps = {
    locationId: string;
    setIsShowModal: React.Dispatch<SetStateAction<boolean>>;
}

type TLocation = {
    day: string;
    locationName: string;
    category: string;
    description: string;
    googleImageUrl?: string;
    images?: string[];
}   

const LocationDetail = ({ locationId, setIsShowModal}:TProps) => {

    const [location, setLocation] = useState<TLocation | null>(null);

    const loadLocation = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/location/${locationId}`);
          setLocation({day: response.data.day, locationName: response.data.locationName, category: response.data.category, description: response.data.description, googleImageUrl: response.data.googleImageUrl, images: response.data.images});
        } catch (e) {
          alert('계획을 불러오는데 실패했습니다.');
        }
      };

    useEffect(() => {
        loadLocation();
    },[]);

    return (
        <div className={style.dimmed_layer} onClick={() => {setIsShowModal(false);}}>
            <div className={style.modal} onClick={(e) => {e.stopPropagation();}}>
                <div className={style.top}>
                    <span className={style.day}>{location?.day}일차</span>
                    <strong className={style.title}>{location?.locationName}</strong>
                    <span className={classNames(style.category, style.type_tourist)}>{location?.category}</span>
                    <button type="button" onClick={() => {setIsShowModal(false);}}><span className="blind">닫기</span></button>
                </div>
                <span className={style.img_wrap}>
                    <img className={style.img} src={location?.googleImageUrl} alt="대표 이미지"/>
                </span>
                <p className={style.desc}>
                    {location?.description}
                </p>
                <button type="button" className={style.save_btn}>저장</button>
            </div>
        </div>
    )
}

export default LocationDetail;