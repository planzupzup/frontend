import style from "@/app/components/TopProfile/TopProfile.module.scss";

type TProps = {
    profile_img?: string,
    nickname: string,
    title?: string,
    location: string,
    date: string,
    isBookmark: boolean
}

const TopProfile = ({profile_img, nickname, title, location, date, isBookmark}:TProps) => {
    return (    
       <div className={style.profile_wrap}>
            <a href="#" className={style.link}>
                <span className={style.img_wrap}>
                    <img className={style.img} src={profile_img} alt="profile"/>
                </span>
            </a>
            <div className={style.info_wrap}>
                <p className={style.nickname}>{nickname}</p>
                <h2 className={style.title_wrap}>
                    {title}<span className={style.bookmark} aria-selected={isBookmark}><span className="blind">즐겨찾기</span></span>
                </h2>
                <div className={style.date_wrap}>
                    <span className={style.location}>{location}</span>
                    <span className={style.date}>{date}</span>
                </div>
            </div>
       </div>
    )
}

export default TopProfile;