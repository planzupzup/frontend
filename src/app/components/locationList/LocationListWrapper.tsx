import LocationList from "@/app/components/locationList/LocationList";
import { Location } from "@/app/plan/[planId]/page";
import style from "@/app/plan/[planId]/Plan.module.scss";
import { getOrderColor } from "@/app/utils/getOrderColor";
/* eslint-disable */
type TProps = {
    selectedDay: string;
    totalLocationList: Location[][];
    setLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
}

const LocationListWrapper = ({ selectedDay, totalLocationList, setLocation} : TProps) => {
    if(selectedDay !== '전체 일정') {
        return <LocationList isTotal={false} locationList={totalLocationList[parseInt(selectedDay, 10) - 1]} setLocation={setLocation} orderColor={getOrderColor(parseInt(selectedDay, 10) - 1)} />
    } else {
        return <div className={style.locationlist_list}>{totalLocationList.map((locationList,index) => (<div className={style.locationlist_item}><span className={style.day}>{index+1}일차</span><LocationList isTotal={true} locationList={locationList} setLocation={setLocation} orderColor={getOrderColor(index)}/></div>))}</div>
    }
}

export default LocationListWrapper;