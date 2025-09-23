"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Destination {
  id: number;
  image: string;
  name: string;
}

const DestinationSelector: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!search.trim()) {
        setDestinations([]);
        return;
      }
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/destination/${search}`, { withCredentials: true });
        setDestinations(response.data.result || []);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setDestinations([]);
      }
    };

    const timer = setTimeout(() => {
      fetchDestinations();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleNavigate = (name: string) => {
    window.location.href = `/create?destinationName=${name}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
    },
    imageBox: {
      width: "220px",
      height: "220px",
      borderRadius: "10px",
      overflow: "hidden",
      objectFit: "cover",
      backgroundColor: "#eee",
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
          onChange={handleSearchChange}
        />
      </div>
        <ul style={styles.searchContainer}>
          {destinations.map((destination) => (
            <li style={{...styles.searchInput, ...styles.item}} key={destination.id} onClick={() => handleNavigate(destination.name)}>{destination.name}</li>
          ))}
        </ul>
      {/* <div style={styles.grid}>
        {destinations.map((destination) => (
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
      </div> */}
    </div>
  );
};

export default DestinationSelector;
