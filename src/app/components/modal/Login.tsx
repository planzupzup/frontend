"use client";

import style from "./Modal.module.scss";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const NAVER_REST_API_KEY = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const KAKAO_REDIRECT_URI = `http://localhost:3000/login/kakao`;

const Login = () => {

    const onClickKakaoLogin = () => {
        window.location.href= `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    }

    const onClickNaverLogin = () => {
        window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_REST_API_KEY}&state=false&redirect_uri=${NAVER_REDIRECT_URI}`;
    }

    return (
        <div className={style.login_wrap}>
            <button type="button" onClick={onClickKakaoLogin}>카카오로 로그인 하기</button>
            <button type="button" onClick={onClickNaverLogin}>네이버로 로그인 하기</button>
        </div>
    )
}

export default Login;