/* eslint-disable */
"use client";

import { useState } from "react";
import { TComment } from "./CommentList";
import style from "./CommentList.module.scss";


const CommentItem = ({thumbnailUrl, nickname, content, commentCount, reCommentCount}:TComment) => {

    const [isExpaneded, setIsExpanded] = useState(false);


    return (
        <li className={style.item}>
            <span className={style.thumb_wrap}>
                {thumbnailUrl && <img className={style.img} src={thumbnailUrl} alt="섬네일 이미지"/>}
            </span>
            <div className={style.text_area}>
                <div className={style.nickname}>{nickname}</div>
                <div className={style.content}>{content}</div>
                <div className={style.reaction_area}>
                    <button type="button" aria-pressed={false} className={style.likes_btn}>
                        <span className="blind">공감</span>{commentCount}
                    </button>
                    <button type="button" aria-expanded={isExpaneded} className={style.re_comment_btn}>
                        답글 {reCommentCount}
                    </button>
                </div>
            </div>
        </li>
    )
}

export default CommentItem;