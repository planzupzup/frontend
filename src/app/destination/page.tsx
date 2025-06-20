"use client";

import React, { useState } from "react";

interface Destination {
  id: number;
  image: string;
  name: string;
}
/* eslint-disable */

const DestinationSelector: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [destonationList] = useState<Destination[]>([
    {
      id: 1,
      image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/4.png",
      name: "제주",
    },
    {
      id: 2,
      image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/3%5C.png",
      name: "뉴욕",
    },
    {
      id: 3,
      image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/paris.png",
      name: "파리",
    },
    {
      id: 4,
      image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/seoul.png",
      name: "서울",
    },
    {
      id: 5,
      image: "https://travel1030.s3.ap-southeast-2.amazonaws.com/4.png",
      name: "오사카",
    },
  ]);

  const filteredList = destonationList.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (name: string) => {
    window.location.href = `/plans/${name}`;
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: "40px 20px",
    },
    title: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: 800,
    },
    spacer: {
      height: "50px",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "30px",
    },
    searchInput: {
      width: "60%",
      padding: "10px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    grid: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
    },
    item: {
      cursor: "pointer",
      textAlign: "center",
    },
    imageBox: {
      width: "220px",
      height: "220px",
      borderRadius: "10px",
      overflow: "hidden",
      objectFit: "cover",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    name: {
      marginTop: "10px",
      fontSize: "20px",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>어디로 여행을 떠나시나요?</div>
      <div style={styles.spacer} />

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="국가명이나 도시명으로 검색해보세요"
          style={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.grid}>
        {filteredList.map((destination) => (
          <div
            key={destination.id}
            style={styles.item}
            onClick={() => handleNavigate(destination.name)}
          >
            <div style={styles.imageBox}>
              <img
                src={
                  destination.image ||
                  "https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/no-image.png"
                }
                alt={destination.name}
                style={styles.image}
              />
            </div>
            <div style={styles.name}>{destination.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationSelector;