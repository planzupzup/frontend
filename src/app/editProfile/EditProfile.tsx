"use client";

import { useEffect, useState } from "react";
import style from "./EditProfile.module.scss";
import axios, { AxiosError } from "axios";

export type TProfile = {
    nickname: string,
    description: string,
    image: string
}

const EditProfile = () => {
    const [profile, setProfile] = useState<TProfile|null>(null);

    useEffect(() => {
        document.body.style.height = 'auto';
    }, [])


    return (
        <div className={style.edit_profile}>
            <div className={style.profile_area}>
                <span className={style.thumb_wrap}>
                    <img src="" alt="프로필이미지" />
                </span>
                <div className={style.btn_wrap}>
                    <input id="photo" type="file" className="blind" />
                    <label htmlFor="photo" className={style.photo_btn}>사진 변경</label>
                    <button type="button" className={style.delete_btn}>삭제</button>
                </div>
            </div>
            <div className={style.info_area}>
                <h1>프로필 수정</h1>
                <div className={style.nickname_area}>
                    <span className={style.text}>닉네임</span>
                    <span className={style.text}>닉네임</span>
                </div>
                <div className={style.desc_area}>
                    <span className={style.text}>나의 여행 스타일 한줄 소개</span>
                    <span className={style.text}>일이삼사오육</span>
                </div>
            </div>
        </div>
    )
}

export default EditProfile;