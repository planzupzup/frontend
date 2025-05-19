"use client";

import React from "react";
import styles from "@/app/page.module.scss";

const Home: React.FC = () => {
  const handlePlanClick = () => {
    window.location.href = "/destination"; // react-router 사용 시 navigate로 대체 가능
  };

  return (
    <>  
      <section className={styles.section_1}>
        <div className={styles.section_1_image}>
          <a href="#" className={styles.link}>
            <h1 className={styles.title}>유튜버처럼 떠나는 여행,<br />지금 시작해보세요</h1>
          </a>
          <span className="blind">
            100만+ 유튜버의 여행루트
          </span>
        </div>
      </section>
      <section className={styles.section_2}>
        <h2 className={styles.title}>보고 끝내지 말고, 직접 떠나보세요</h2>
        <p className={styles.desc}>유튜버 & 인플루언서들의 여행 루트를 나도 경험할 수있어요!</p>
      </section>
      <section className={styles.section_3}>
        <ul className={styles.list}>
          <li className={styles.item}>
            <img src="/img_section_3_290x290.png" alt="섬네일" className={styles.img}/>
            <div className={styles.info_area}>
              <h2 className={styles.title}>곽튜브는 맛집만 골라간다?<br />그게 바로 여행의 묘미!</h2>
              <p className={styles.desc}>곽튜브와 함께라면, 평범한 여행도 특별해집니다.<br/>일이삼사오육칠팔구십일이삼사오육칠팔구십<br/>일이삼사오육칠팔구십일이삼사오육칠팔구십</p>
              <div className={styles.link_area}>
                <a href="#" className={styles.youtube_link}>유튜브 보러가기</a>
                <a href="#" className={styles.follow_link}>따라가기</a>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <section className={styles.section_5}>
        <h2 className={styles.title}>당신만의 여행을 만들어보세요!</h2>
        <p className={styles.desc}>유튜버의 루트를 참고해, 내 여행에 맞게 플랜을 짜보세요<br />장소, 일정, 동선까지 한눈에 정리할 수 있어요</p>
        <a href="#" className={styles.link}>플랜 만들기</a>
        <ul className={styles.list}>
          <li className={styles.item}>
            <img src="/img_jeju_island.png" alt="섬네일" className={styles.img}/>
            <div className={styles.info_area}>
              <div className={styles.day_wrap}>
                <span className={styles.day}>N일차</span>
              </div>
              <h3 className={styles.sub_title}>[일이삼사오육칠팔구십]</h3>
              <p className={styles.sub_desc}>일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</p>
            </div>
          </li>
          <li className={styles.item}>
            <img src="/img_jeju_island.png" alt="섬네일" className={styles.img}/>
            <div className={styles.info_area}>
              <div className={styles.day_wrap}>
                <span className={styles.day}>N일차</span>
              </div>
              <h3 className={styles.sub_title}>[일이삼사오육칠팔구십]</h3>
              <p className={styles.sub_desc}>일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</p>
            </div>
          </li>
        </ul>
      </section>
      <section className={styles.section_6}>
        <h2 className={styles.title}>함께 소통하고 공유해요</h2>
        <p className={styles.desc}>옹심이들의 여행루트도 살펴보고 공유할 수 있어요!</p>
        <div className={styles.link_wrap}>
          <a href="#" className={styles.link}>플랜 만들기</a>
        </div>
        <ul className={styles.list}>
          <li className={styles.item}>
            <img src="/img_jeju_island.png" alt="섬네일" className={styles.img}/>
            <div className={styles.info_area}>
              <div className={styles.day_wrap}>
                <span className={styles.day}>N일차</span>
              </div>
              <h3 className={styles.sub_title}>[일이삼사오육칠팔구십]</h3>
              <p className={styles.sub_desc}>일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</p>
            </div>
          </li>
          <li className={styles.item}>
            <img src="/img_jeju_island.png" alt="섬네일" className={styles.img}/>
            <div className={styles.info_area}>
              <div className={styles.day_wrap}>
                <span className={styles.day}>N일차</span>
              </div>
              <h3 className={styles.sub_title}>[일이삼사오육칠팔구십]</h3>
              <p className={styles.sub_desc}>일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십</p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Home;