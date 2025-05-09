"use client";

import React, { useState } from "react";
import LoginModal from "./modal/LoginModal";

const Header: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [loginModal, setLoginModal] = useState<boolean>(false);

  const handleLogin = () => {
    setLoginModal(true);
  };

  const handleLogout = () => {
    setIsLogin(false);
    setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const styles: { [key: string]: React.CSSProperties } = {
    appBar: {
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "10px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontWeight: "bold",
      color: "#333",
      textDecoration: "none",
      fontSize: "24px",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    customButton: {
      fontWeight: "bold",
      fontSize: "18px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#333",
      padding: "8px 16px",
    },
    profileSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      position: "relative",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      overflow: "hidden",
    },
    avatarImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    profileMenu: {
      position: "absolute",
      top: "60px",
      right: "0",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "5px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      minWidth: "150px",
      zIndex: 10,
    },
    menuItem: {
      display: "block",
      width: "100%",
      padding: "10px",
      background: "none",
      border: "none",
      textAlign: "left",
      fontSize: "16px",
      cursor: "pointer",
      color: "#333",
    },
  };

  return (
    <div style={styles.appBar}>
      <a href="/" style={styles.logo}>
        TRAVELER
      </a>

      <div style={styles.navLinks}>
        <button
          style={styles.customButton}
          onClick={() => (window.location.href = "/destination")}
        >
          여행지
        </button>
      </div>

      <div style={styles.navLinks}>
        {!isLogin ? (
          <button style={styles.customButton} onClick={handleLogin}>
            로그인
          </button>
        ) : (
          <div style={styles.profileSection} onClick={toggleProfileMenu}>
            <div style={styles.avatar}>
              <img
                src="https://travel1030.s3.ap-southeast-2.amazonaws.com/paris.png"
                alt="Profile"
                style={styles.avatarImg}
              />
            </div>
            <span style={{ fontSize: "17px" }}>김용이</span>

            {profileMenuOpen && (
              <div style={styles.profileMenu}>
                <a href="/mypage" style={styles.menuItem}>
                  마이페이지
                </a>
                <button style={styles.menuItem} onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {
        loginModal && <LoginModal isShowModal={loginModal} onClickCloseBtn={() => {setLoginModal(false)}} />
      }
    </div>
  );
};

export default Header;