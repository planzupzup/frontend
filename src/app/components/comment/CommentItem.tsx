/* eslint-disable */
"use client";

import { useState } from "react";
import CommentList, { TComment } from "./CommentList";
import style from "./CommentList.module.scss";

type TProps = TComment;


const CommentItem = ({profileImage, nickName, content, likesCount, isLiked, parentId, childrenCount}:TProps) => {

    const [isExpaneded, setIsExpanded] = useState(false);

    const onClickReCommentBtn = () => {
        setIsExpanded(!isExpaneded);
    }

    return (
        <li className={style.item}>
            <span className={style.thumb_wrap}>
                {profileImage && <img className={style.img} src={profileImage} alt="섬네일 이미지"/>}
            </span>
            <div className={style.text_area}>
                <div className={style.nickname}>{nickName}</div>
                <div className={style.content}>{content}</div>
                <div className={style.reaction_area}>
                    <button type="button" aria-pressed={isLiked} className={style.likes_btn}>
                        <span className="blind">공감</span>{likesCount}
                    </button>
                    {childrenCount !== null && parentId && <button type="button" aria-expanded={isExpaneded} className={style.re_comment_btn} onClick={onClickReCommentBtn}>
                        답글 {childrenCount}
                    </button>}
                </div>
                {
                    isExpaneded && 
                        <div className={style.re_comment_area}>
                            <CommentList parentId={parentId} />
                        </div>
                }
            </div>
        </li>
    )
}

export default CommentItem;