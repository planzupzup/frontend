
"use client";

import React, { useState } from "react";
import axios from "axios";

interface PlanCreateModalProps {
  open: boolean;
  destination: string;
  onClose: () => void;
  onCreatePlan?: (plan: any) => void;
}

const PlanCreateModal: React.FC<PlanCreateModalProps> = ({ open, destination, onClose, onCreatePlan }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const createPlan = async () => {
    const newPlan = {
      startDate,
      endDate,
      title,
      destinationName: destination,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plan`, newPlan);
      console.log("Plan created:", response.data);

      onCreatePlan?.(newPlan);
      onClose();
      window.location.href = `/plan/${response.data.result.planId}`;
    } catch (error) {
      console.error("Failed to create plan:", error);
    }
  };

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.spacer} />
        <div style={styles.title}>여행 기간이 어떻게 되시나요?</div>

        <div style={styles.row}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
            placeholder="시작 날짜"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
            placeholder="종료 날짜"
          />
        </div>

        <div style={styles.row}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="여행 주제"
          />
        </div>

        <div style={styles.button} onClick={createPlan}>
          일정 생성하기
        </div>
        <div style={styles.spacer} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    width: "700px",
    padding: "30px 20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spacer: { height: "10px" },
  title: {
    fontSize: "30px",
    fontWeight: 500,
    textAlign: "center",
    marginBottom: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    width: "100%",
    maxWidth: "600px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    backgroundColor: "black",
    color: "white",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    marginTop: "10px",
  },
};

export default PlanCreateModal;