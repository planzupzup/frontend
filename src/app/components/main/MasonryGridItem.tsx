"use client";

import styles from "@/app/page.module.scss";

type TProps = {
    ProfileImageUrl: string;
    nickname: string;
    title: string;
    desc: string;
}

const MasonryGridItem = ({ProfileImageUrl, nickname, title, desc} : TProps) => {

    return (
        <div className={styles.item}>
            <div className={styles.profile}>
                <img src={ProfileImageUrl} alt="프로필 이미지" className={styles.img}/>
                <span className={styles.nickname}>{nickname}</span>
            </div>
            <h3 className={styles.plan_title}>{title}</h3>
            <p className={styles.desc}>{desc}</p>
        </div>
    )
}

export default MasonryGridItem;