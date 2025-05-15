import LocationList from "@/app/components/locationList/LocationList";
import { Location } from "@/app/plan/[planId]/page";

type TProps = {
    selectedDay: string;
    totalLocationList: Location[][];
    setLocation: React.Dispatch<React.SetStateAction<Location | undefined>>;
}

const LocationListWrapper = ({ selectedDay, totalLocationList, setLocation} : TProps) => {
    if(selectedDay !== '전체 일정') {
        return <LocationList locationList={totalLocationList[parseInt(selectedDay, 10) - 1]} setLocation={setLocation} />
    } else {
        return totalLocationList.map(locationList => <LocationList locationList={locationList} setLocation={setLocation}/>)
    }
}

export default LocationListWrapper;