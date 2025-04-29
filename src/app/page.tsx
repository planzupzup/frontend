"use client";

import React from "react";

const Home: React.FC = () => {
  const handlePlanClick = () => {
    window.location.href = "/destination"; // react-router 사용 시 navigate로 대체 가능
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    spacer: {
      height: "50px",
    },
    infoMent: {
      fontSize: "30px",
      fontWeight: 800,
      textAlign: "center",
    },
    smallFont: {
      color: "#828282",
      fontSize: "18px",
      textAlign: "center",
      marginTop: "20px",
    },
    blackButton: {
      backgroundColor: "black",
      color: "white",
      padding: "10px 20px",
      cursor: "pointer",
      marginTop: "30px",
      textAlign: "center",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spacer} />
      <div style={styles.infoMent}>
        기존에 경험하지 못한 새로운 여행 플래너
      </div>
      <div style={styles.spacer} />
      <div style={styles.smallFont}>
        고민만 하던 여행 계획을 트래블러로 스케줄링 해보세요
      </div>
      <div style={styles.blackButton} onClick={handlePlanClick}>
        여행 계획하기
      </div>
    </div>
  );
};

export default Home;