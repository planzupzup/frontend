"use client";

import { Location } from "@/app/plan/[planId]/page";
import style from "@/app/plan/[planId]/Plan.module.scss";
import { getTimeUnit } from "@/app/utils/getTimeUnit";
import { useState } from "react";
import LocationItem from "@/app/components/locationList/LocationItem";

type TProps = {
    day?: number;
    locationList: Location[];
    location: Location | undefined;
    setLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
}

const LocationList = ({ day, locationList, location, setLocation }:TProps) => {

    return (
        <div className={style.location_list}>
            {locationList.map((location, idx) => (
            <>
                {idx>0 && <div className={style.duration}>{getTimeUnit(location.duration)}</div>}
                <LocationItem location={location} setLocation={setLocation} />
            </>
            ))}
        </div>
    )
}

export default LocationList;