import style from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={style.footer_wrap}>
            <ul className={style.list}>
                <li className={style.item}>
                    © 2025
                </li>
                <li className={style.item}>
                    개인정보 처리방침
                </li>
                <li className={style.item}>
                    쿠키 정책
                </li>
                <li className={style.item}>
                    이용약관
                </li>
                <li className={style.item}>
                    사이트맵
                </li>
            </ul>
            <p className={style.text}>
                웹사이트 제공자
            </p>
        </footer>
    )   
}

export default Footer;