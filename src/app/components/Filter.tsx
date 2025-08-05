import { useState } from "react";
import style from "./Filter.module.scss";

type TFilter = {
    firstText: string,
    secondText: string,
    thirdText?: string,
    onClickFirstBtn: () => void,
    onClickSecondBtn: () => void,
    onClickThirdBtn?: () => void,
}

const Filter = ({firstText, secondText, thirdText, onClickFirstBtn, onClickSecondBtn, onClickThirdBtn}:TFilter) => {
    const [isClickFirst, setIsClickFirst] = useState(true);
    const [isClickSecond, setIsClickSecond] = useState(false);
    const [isClickThird, setIsClickThird] = useState(false);

    return (
        <div className={style.btn_wrap}>
            <button type="button" className={style.btn} onClick={() => {setIsClickSecond(false);setIsClickFirst(true);setIsClickThird(false); onClickFirstBtn()}} aria-selected={isClickFirst}>{firstText}</button>
            <button type="button" className={style.btn} onClick={() => {setIsClickSecond(true);setIsClickFirst(false);setIsClickThird(false);onClickSecondBtn();}} aria-selected={isClickSecond}>{secondText}</button>
            {thirdText && onClickThirdBtn && <button type="button" className={style.btn} onClick={() => {setIsClickSecond(false);setIsClickFirst(false);setIsClickThird(true); onClickThirdBtn();}} aria-selected={isClickThird}>{thirdText}</button>}
        </div>
    )
}

export default Filter;