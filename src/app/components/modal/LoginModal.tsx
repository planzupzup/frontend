"use client";

import Login from "./Login";
import style from "./Modal.module.scss";

type TModal = {
    text?: string;
    isShowModal: boolean;
    onClickCloseBtn: () => void;
}
/* eslint-disable */
const LoginModal = ({text, isShowModal, onClickCloseBtn}:TModal) => {
    return (
        isShowModal && (
            <div className={style.modal_wrap}>
                <div className={style.modal_area}>
                    <div className={style.header}>
                        <button type="button" onClick={onClickCloseBtn} className={style.close_btn}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" className={style.svg}><path d="m6 6 20 20M26 6 6 26"></path></svg>
                        </button>
                        {text}
                        <Login />
                    </div>
                </div>
            </div>
        )
    )
}

export default LoginModal;