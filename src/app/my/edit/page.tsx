"use client";

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import style from "./MyEdit.module.scss";
import axios from "axios";
import { TProfile } from "../page";

const Edit = () => {

    const [profile, setProfile] = useState<TProfile|null>(null);

    const fetchProfile = async () => {
        try {
            const data = await axios.get(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/my-page`, {withCredentials: true});
            setProfile(data.data.result);
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchProfile();
        document.body.style.height = 'auto';
    },[]);

    return (
        <div className={style.my_edit}>
            <div className={style.image_area}>
                <span className={style.thumb_wrap}>
                    {profile?.image && <img className={style.img} src={profile?.image} alt="프로필이미지" />}
                </span>
                <div className={style.btn_wrap}>
                    <button type="button" className={style.edit_btn}>사진 변경</button>
                    <button type="button" className={style.delete_btn}>삭제</button>
                </div>
            </div>
            <div className={style.info_area}>
                <h2 className={style.head_title}>프로필 수정</h2>
                <div className={style.nickname_wrap}>
                    <div className={style.sub_title}>닉네임</div>
                    <div className={style.nickname}>{profile?.nickName}</div>
                </div>
                <div className={style.description_wrap}>
                    <div className={style.sub_title}>나의 여행 스타일 한줄 소개</div>
                    <p className={style.description}>{profile?.description ?  profile.description : "소개가 없습니다."}</p>
                </div>
                <div className={style.btn_area}>
                    <button type="button" >저장</button>
                    <button type="button" >취소</button>
                </div>
            </div>
        </div>
    )
}

export default Edit;