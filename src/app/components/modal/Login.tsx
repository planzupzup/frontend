"use client";

import style from "./Modal.module.scss";

export const BACK_HOST = process.env.NEXT_PUBLIC_BACK_HOST;

const Login = () => {

    const onClickKakaoLogin = () => {
        window.location.href= `${BACK_HOST}/oauth2/authorization/kakao`;
    }

    return (
        <div className={style.login_wrap}>
            <button type="button" onClick={onClickKakaoLogin}>카카오로 로그인 하기</button>
        </div>
    )
}

export default Login;