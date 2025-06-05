"use client";

import { Location } from "@/app/plan/[planId]/page";
import style from "@/app/plan/[planId]/Plan.module.scss";

type TProps = {
    isTotal?: boolean; 
    location: Location;
    locationIndex: number;
    setLocation?: React.Dispatch<React.SetStateAction<Location | undefined>>;
}

const LocationItem = ({ isTotal, location, locationIndex, setLocation }:TProps) => {

    return (
        isTotal ? <div key={location.locationId} className={style.location_total_item} onClick={() => setLocation && setLocation(location)}>
        <div className={style.order}>{locationIndex}</div>
        <div className={style.name}>{location.locationName}</div>
        <div className={style.img_wrap}>
            <img src={location.image?.imageUrl} className={style.img}/>
        </div>
        {/* <div className={style.category}>{location.category}</div> */}
    </div> : <div key={location.locationId} className={style.location_item} onClick={() => setLocation && setLocation(location)}>
        <a href="#" className={style.link}>
            <div className={style.img_wrap}>
                <img src={location.image?.imageUrl} className={style.img}/>
            </div>
        </a>
        <div>
            <div className={style.order}>{locationIndex}</div>
            <div className={style.name}>{location.locationName}</div>
            <div className={style.likes}>4.8</div>
        </div>
    </div>
    )
}

export default LocationItem;