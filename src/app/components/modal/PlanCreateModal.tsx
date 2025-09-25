
"use client";
/* eslint-disable */

import React, { useEffect, useRef } from "react";
import style from "./Modal.module.scss"
import { useRouter } from "next/navigation";

interface PlanCreateModalProps {
  isOpen: boolean;
  destinationName: string;
  image?: string;
  onClose: () => void;
  onCreatePlan?: (plan: any) => void;
  onConfirm?: (name: string) => void
}
const PlanCreateModal: React.FC<PlanCreateModalProps> = ({ isOpen, destinationName, image, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const plansPageRouter = () => {
    router.push(`/plans/${destinationName}`);
    onClose();
  }

  return (
    <div className={style.overlay} onClick={(e) => {
      e.stopPropagation();
    }}>
      <div className={style.modal} ref={modalRef}>
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%", textAlign: "end" }}><button onClick={() => onClose()}><img src="/x.svg" alt="" /></button></div>
        <h3 className={style.title}><span style={{ color: "#3C76F1" }}>{destinationName}</span>(으)로 플랜 줍줍하러가볼까?</h3>
      </div>
      <img className={style.image} src={image} alt={destinationName} />
      <div style={{ display: "flex", justifyContent: "end", width: "100%", gap: "11px" }}>
        <button onClick={plansPageRouter} className={style.button} style={{ border: "1px solid #E2E2E2" }} >
          플랜줍기
        </button>
        {onConfirm &&
          <button className={style.button} style={{ background: "#3C76F1", color: "#fff" }} onClick={() => onConfirm(destinationName)}>
            플랜만들기
          </button>
        }
      </div>
      <div className={style.spacer} />
    </div>
    </div >
  );
};

export default PlanCreateModal;