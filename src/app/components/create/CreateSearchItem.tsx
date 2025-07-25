/* eslint-disable */
"use client";

import { useState } from "react";
import style from "./CreateSearchList.module.scss";
import { Place } from "@/app/hooks/useGoogleMapService";

type TCreateSearchItem = {
    place: Place;
}

const CreateSearchItem = ({place}:TCreateSearchItem) => {

    const {name, formatted_address, photos, types, rating} = place;

    return (
        <li className={style.item}>
            <div className={style.content}>
                <div className={style.thumb_wrap}>
                    <img src={photos?.length > 0 ? photos[0].getUrl() : ""} alt="섬네일"/>
                </div>
                <div className={style.info_area}>
                    <strong className={style.title}>{name}</strong>
                    <span className={style.review}>{rating}</span>
                </div>
            </div>
            <button className={style.add_btn}>
                <span className="blind">장소추가하기</span>
            </button>
        </li>
    )
}

export default CreateSearchItem;