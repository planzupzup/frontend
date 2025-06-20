"use client";
/* eslint-disable */
import React, { useState} from "react";
import { useParams } from "next/navigation";
import PlanCreateModal from "../../components/modal/PlanCreateModal";

interface Place {
  name: string;
}

interface Plan {
  id: number;
  title: string;
  contents: string;
  startDate: string;
  endDate: string;
  placeList: Place[];
}

// 🔹 메인 컴포넌트
const PlanList: React.FC = () => {
  const { destination } = useParams<{ destination: string }>();
  const [planCreateModal, setPlanCreateModal] = useState(false);

  const [planList] = useState<Plan[]>([
    {
      id: 1,
      title: "미국미국",
      contents: "진짜 최고였음",
      startDate: "2024-11-11",
      endDate: "2024-11-29",
      placeList: [{ name: "성산일출봉" }, { name: "협재 해변" }, { name: "협재 해변" }],
    },
    {
      id: 2,
      title: "제주제주",
      contents: "진짜 최고였음",
      startDate: "2024-11-11",
      endDate: "2024-11-29",
      placeList: [{ name: "성산일출봉" }, { name: "협재 해변" }, { name: "협재 해변" }],
    },
    {
      id: 3,
      title: "일본일본",
      contents: "진짜 최고였음",
      startDate: "2024-11-11",
      endDate: "2024-11-29",
      placeList: [{ name: "성산일출봉" }, { name: "협재 해변" }, { name: "협재 해변" }],
    },
  ]);

  const formatPlaceList = (places: Place[]) => {
    const names = places.map((p) => p.name);
    return names.length > 2 ? `${names.slice(0, 2).join(", ")} 등` : names.join(", ");
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: "40px 20px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: 600,
    },
    button: {
      fontSize: "16px",
      fontWeight: 500,
      backgroundColor: "#62c2ee",
      padding: "8px 16px",
      borderRadius: "10px",
      color: "white",
      cursor: "pointer",
    },
    cardGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
    },
    card: {
      flex: "1 1 calc(50% - 20px)",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    cardText: {
      fontSize: "16px",
      lineHeight: "1.5",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.title}>
          {destination}을 다녀온 사람들의 여행 계획 ✈️
        </div>
        <div style={styles.button} onClick={() => setPlanCreateModal(true)}>
          내 일정 만들기
        </div>
      </div>

      <div style={styles.cardGrid}>
        {planList.map((plan) => (
          <div key={plan.id} style={styles.card}>
            <div style={styles.cardTitle}>{plan.title}</div>
            <div style={styles.cardText}>
              <p>{plan.contents}</p>
              <p>여행 기간: {plan.startDate} ~ {plan.endDate}</p>
              <p>방문 장소: {formatPlaceList(plan.placeList)}</p>
            </div>
          </div>
        ))}
      </div>

      <PlanCreateModal
        open={planCreateModal}
        destination={destination || ""}
        onClose={() => setPlanCreateModal(false)}
      />
    </div>
  );
};

export default PlanList;

export const runtime = 'edge';