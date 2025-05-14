"use client";

import { Location } from "@/app/plan/[planId]/page";
import style from "@/app/plan/[planId]/Plan.module.scss";

type TProps = {
    location: Location;
    setLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
}

const LocationItem = ({ location, setLocation }:TProps) => {

    return (
        <div key={location.id} className={style.location_item} onClick={() => setLocation(location)}>
            <div className={style.order}>{location.scheduleOrder}</div>
            <div className={style.name_wrap}>
                <div className={style.name}>{location.locationName}</div>
                <div className={style.category}>{location.category}</div>
            </div>
            <div className={style.img_wrap}>
                <img src={location.image?.imageUrl} className={style.img}/>
            </div>
        </div>
    )
}

export default LocationItem;