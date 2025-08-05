"use client";

import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import style from "./search.module.scss";
import axios from "axios";

export type TPlan = {
    planId: string,
    title: string,
    profileImage: string,
    nickname: string,
    destinationName: string,
    bookMarkCount: number,
    commentCount: number,
    isBookMarked: boolean
}

const Search = () => {
        const [page, setPage] = useState(0);
        const [hasMore, setHasMore] = useState(true);
        const [loading, setLoading] = useState(false);
        const [searchInput, setSearchInput] = useState("");
        const [plans, setPlans] = useState<TPlan[]>([]);
        const [isSearchEnd , setIsSearchEnd] = useState(false);
    
        // 무한 스크롤 감지를 위한 관찰 대상 요소
        const observerTarget = useRef<HTMLDivElement>(null);
    
        const fetchSearchPlans = useCallback(async () => {
            if (loading || !hasMore) return;
    
            setLoading(true);
            try {
                let response;
                
                response = await fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/plan/search/${searchInput}/LATEST?page=${page}`);
    
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
    
                const data = await response.json();
    
                setPlans(prevPlans => [...prevPlans, ...data.result.content]);
                setPage(prevPage => prevPage + 1);

                if(parseInt(data.result.page, 10) >= parseInt(data.result.totalPages,10)) setHasMore(false);

            } catch (error) {
                console.error("플랜 검색 실패:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        }, [page, loading, hasMore, searchInput]);

        const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchInput(e.target.value);
        }

        const onKeyDownEnter = async (e: KeyboardEvent) => {
            if(e.key === 'Enter') {    
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/plan/search/${searchInput}/LATEST?page=0}`);
                    setPlans(response.data.result);
                    console.log(plans);
                    setIsSearchEnd(true);
                } catch(e) {
                    console.log(e);
                }
            }
        }
    
        useEffect(() => {
            if(isSearchEnd && searchInput.length>0) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting && hasMore && !loading) {
                        fetchSearchPlans();
                    }
                }, {
                    threshold: 1.0,
                });
        
                const currentObserverTarget = observerTarget.current;
        
                if (currentObserverTarget) {
                    observer.observe(currentObserverTarget);
                }
        
                return () => {
                    if (currentObserverTarget) {
                        observer.unobserve(currentObserverTarget);
                    }
                };
            }
        }, [fetchSearchPlans]);

    return (
        <div className={style.search_wrap}>
            <div className={style.search_field_wrap}>
                <div className={style.search_field}>
                    <input type="text" placeholder="지금 어디로 떠나고 싶으신가요?" value={searchInput} onChange={onChangeSearchInput} onKeyDown={onKeyDownEnter}/>
                </div>
                <h1 className={style.main_title}>인기 여행 플랜을 나의 플랜으로 줍줍해보세요!</h1>
                <a href="/create" className={style.make_plan_link}>플랜만들기</a>
            </div>
            <ul className={style.list}>
                {
                    plans.map((plan) => {
                        return (
                            <li className={style.item}>
                                <a href="#" className={style.link}>
                                    <span className={style.img_wrap}>
                                        <img className={style.img} src={plan.profileImage} alt="프로필 이미지"/>
                                    </span>
                                    <div className={style.info_area}>
                                        <div className={style.days}>{plan.destinationName} - 1DAY</div>
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
            <div ref={observerTarget} style={{height: "100px"}}></div>
        </div>
    )
}

export default Search;