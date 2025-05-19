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
    </>
  );
};

export default Home;