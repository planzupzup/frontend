"use client";

import React, { useState } from "react";
import styles from "@/app/components/Header.module.scss";
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

  return (
    <header className={styles.header_wrap}>
      <a href="/" className={styles.logo}>
        LOGO
      </a>
      <div className={styles.nav_area}>
        <div className={styles.nav}>
          <button
            className={styles.customButton}
            onClick={() => (window.location.href = "/destination")}
          >
            플랜만들기
          </button>
        </div>
        <div className={styles.nav}>
          <button
            className={styles.customButton}
            onClick={() => (window.location.href = "/destination")}
          >
            플랜보기
          </button>
        </div>

        <div className={styles.nav}>
          {!isLogin ? (
            <button className={styles.customButton} onClick={handleLogin}>
              로그인
            </button>
          ) : (
            <div className={styles.profileSection} onClick={toggleProfileMenu}>
              <div className={styles.avatar}>
                <img
                  src="https://travel1030.s3.ap-southeast-2.amazonaws.com/paris.png"
                  alt="Profile"
                  className={styles.avatarImg}
                />
              </div>
              <span>김용이</span>

              {profileMenuOpen && (
                <div className={styles.profileMenu}>
                  <a href="/mypage" className={styles.menuItem}>
                    마이페이지
                  </a>
                  <button className={styles.menuItem} onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {
        loginModal && <LoginModal isShowModal={loginModal} onClickCloseBtn={() => {setLoginModal(false)}} />
      }
    </header>
  );
};

export default Header;