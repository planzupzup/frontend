"use client";

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import style from "./My.module.scss";
import axios from "axios";
import Filter from "@/app/components/Filter";

export type TProfile = {
    nickname: string,
    description: string,
    profileImg: string
}

const My = () => {


    useEffect(() => {
        document.body.style.height = 'auto';
    }, [])

        const plans = [
            {
                planId: "1",
                profileImage: "awdawd",
                destinationName: "asdsad",
                days: 3,
                title: "awdwad",
                bookMarkCount: 123,
                commentCount: 23
            },
            {
                planId: "1",
                profileImage: "awdawd",
                destinationName: "asdsad",
                days: 3,
                title: "awdwad",
                bookMarkCount: 123,
                commentCount: 23
            },{
                planId: "1",
                profileImage: "awdawd",
                destinationName: "asdsad",
                days: 3,
                title: "awdwad",
                bookMarkCount: 123,
                commentCount: 23
            }
            ,{
                planId: "1",
                profileImage: "awdawd",
                destinationName: "asdsad",
                days: 3,
                title: "awdwad",
                bookMarkCount: 123,
                commentCount: 23
            }
            ,{
                planId: "1",
                profileImage: "awdawd",
                destinationName: "asdsad",
                days: 3,
                title: "awdwad",
                bookMarkCount: 123,
                commentCount: 23
            }
        ]

    const [filter1, setFilter1] = useState("LATEST");
    // useEffect 유발 트리거 
    const [searchKeyword, setSearchKeyword] = useState("");

    // 무한 스크롤 감지를 위한 관찰 대상 요소
    const observerTarget = useRef<HTMLDivElement>(null);

    return (
        <div className={style.my}>
            <div className={style.profile_wrap}>
                <div className={style.profile_area}>
                    <strong className={style.nickname}>홍길동처럼 떠나는 여행</strong>
                    <p className={style.desc}>여행다닐땐 이재용처럼 스껄하게! 재벌 2세</p>
                    <div className={style.btn_wrap}>
                        <button type="button" className={style.edit_btn}>프로필 수정</button>
                        <button type="button" className={style.setting_btn}>설정</button>
                    </div>
                    <span className={style.thumb_wrap}>
                        <img className={style.img} alt="프로필이미지" />
                    </span>
                </div>
            </div>
            <div className={style.plans_wrap}>
                <div className={style.plans_area}>
                    <div className={style.title_wrap}>
                        <span className={style.title_area}>
                            <strong className={style.title}>내가 만든 플랜</strong>
                            <span className={style.count}>45</span>
                        </span>
                    </div>
                    <ul className={style.list}>
                        {
                            plans.map((plan) => {
                                return (
                                    <li className={style.item}>
                                        <a href={`/plan/${plan.planId}`} className={style.link}>
                                            <span className={style.img_wrap}>
                                                <img className={style.img} src={plan.profileImage} alt="프로필 이미지"/>
                                            </span>
                                            <div className={style.info_area}>
                                                <div className={style.days}>{plan.destinationName} - {plan.days}DAY</div>
                                                <strong className={style.title}>{plan.title}</strong>
                                                <div className={style.sub_info}>
                                                    <span className={style.likes}>{plan.bookMarkCount}</span>
                                                    <span className={style.comments}>{plan.commentCount}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <button type="button" className={style.more_btn}>더보기</button>
                </div>
                <div className={style.plans_area}>
                    <div className={style.title_wrap}>
                        <span className={style.title_area}>
                            <strong className={style.title}>찜한 플랜</strong>
                            <span className={style.count}>45</span>
                        </span>
                    </div>
                    <ul className={style.list}>
                        {
                            plans.map((plan) => {
                                return (
                                    <li className={style.item}>
                                        <a href={`/plan/${plan.planId}`} className={style.link}>
                                            <span className={style.img_wrap}>
                                                <img className={style.img} src={plan.profileImage} alt="프로필 이미지"/>
                                            </span>
                                            <div className={style.info_area}>
                                                <div className={style.days}>{plan.destinationName} - {plan.days}DAY</div>
                                                <strong className={style.title}>{plan.title}</strong>
                                                <div className={style.sub_info}>
                                                    <span className={style.likes}>{plan.bookMarkCount}</span>
                                                    <span className={style.comments}>{plan.commentCount}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <button type="button" className={style.more_btn}>더보기</button>
                </div>
            </div>
        </div>
    )
}

export default My;