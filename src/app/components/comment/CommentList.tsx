/* eslint-disable */
"use client";

import CommentItem from "./CommentItem";
import style from "./CommentList.module.scss";

export type TComment = {
    thumbnailUrl?: string;
    nickname: string;
    content: string;
    commentCount: string;
    reCommentCount: string;
}

const CommentList = () => {
    const thumbnailUrl = undefined;

    const DEMO_PROPS:TComment[]= [
        {
            nickname: "일이삼사오육칠",
            content: "일이삼사오육칠",
            commentCount: "12413",
            reCommentCount: "23"
        },
        {
            nickname: "일이삼사오육칠",
            content: "일이삼사오육칠",
            commentCount: "12413",
            reCommentCount: "23"
        },
        {
            nickname: "일이삼사오육칠",
            content: "일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠일이삼사오육칠",
            commentCount: "124",
            reCommentCount: "2323"
        },
        {
            nickname: "일이삼사오육칠",
            content: "일이삼사오육칠",
            commentCount: "12413",
            reCommentCount: "23"
        },
        {
            nickname: "일이삼사오육칠",
            content: "일이삼사오육칠",
            commentCount: "12413",
            reCommentCount: "23"
        },
        
    ]

    return (
        <div className={style.comment_list}>
            <div className={style.count_wrap}>
                댓글&nbsp;
                <span className={style.count}>124</span>
            </div>
            <div className={style.textarea_wrap}>
                <span className={style.thumb_wrap}>{thumbnailUrl && <img className={style.img} src="" alt="섬네일 이미지" />}</span>
                <textarea placeholder={"댓글을 입력하세요"} className={style.textarea} />
            </div>
            <ul className={style.list}>
                {
                    DEMO_PROPS.map((item, idx) => <CommentItem nickname={DEMO_PROPS[idx].nickname} content={DEMO_PROPS[idx].content} commentCount={DEMO_PROPS[idx].commentCount} reCommentCount={DEMO_PROPS[idx].reCommentCount} />)
                }
            </ul>
        </div>
    )
}

export default CommentList;