import React, { useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Location } from '@/app/plan/[planId]/page';
import LocationItem from '../locationItem/LocationItem';
import { getOrderColor } from '@/app/utils/getOrderColor';
import style from "@/app/plan/[planId]/Plan.module.scss";
/* eslint-disable */
type TProps = {
    totalLocationList : Location[][];
    setTotalLocationList : React.Dispatch<React.SetStateAction<Location[][]>>;
    selectedDay : string;
}

const LocationListEditWrapper = ({ totalLocationList, setTotalLocationList, selectedDay} : TProps) => {

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) return;

        const sourceIndex = parseInt(source.droppableId, 10);
        const destinationIndex = parseInt(destination.droppableId, 10);

        const sourceColumn = [...totalLocationList[sourceIndex]];
        const destColumn = [...totalLocationList[destinationIndex]];
        const [moveItem] = sourceColumn.splice(source.index, 1);

        const newLocations = [...totalLocationList];

        if (sourceIndex === destinationIndex) {
            sourceColumn.splice(destination.index, 0, moveItem);
            newLocations[sourceIndex] = sourceColumn;
        } else {
            destColumn.splice(destination.index, 0, moveItem);
            newLocations[sourceIndex] = sourceColumn;
            newLocations[destinationIndex]= destColumn;
            if(sourceColumn.length === 0) {
                newLocations.splice(sourceIndex, 1);
            }
        }

        setTotalLocationList(newLocations);
    }

    const deleteEditItem = (order: number) => {
        const dayIndex = parseInt(selectedDay, 10) - 1;
        
        if(dayIndex >=0) {
            const newTotalLocationList = [...totalLocationList];

            if(newTotalLocationList[dayIndex]) {
                const updateDayColumn = newTotalLocationList[dayIndex].filter((_,index) => order-1 !==index);
                console.log(updateDayColumn);
                newTotalLocationList[dayIndex] = updateDayColumn;
            }

            setTotalLocationList(newTotalLocationList);
        }
    }
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', gap: '8px' }} >
                {totalLocationList.filter(column => column.length > 0).map((column, columnIndex) => 
                    ((selectedDay !== "전체 일정" && columnIndex === parseInt(selectedDay, 10) -1) || (selectedDay === "전체 일정")) && <Droppable droppableId={`${columnIndex}`} key={columnIndex}>
                    {(provided) => (
                        <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={style.droppable_wrap}
                        >
                        {column.map((location, index) => {
                            return <Draggable
                            key={location.locationId}
                            draggableId={`${location.locationId}`}
                            index={index}
                            >
                            {(provided) => (
                                <div ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={style.drag_item_wrap}>
                                    <LocationItem location={location} locationIndex={index + 1} orderColor={getOrderColor(index)} isEdit={true} deleteEditItem={deleteEditItem} day={columnIndex} totalLocationList={totalLocationList} setTotalLocationList={setTotalLocationList}/>
                                </div>
                            )}
                            </Draggable>}
                        )}
                        {provided.placeholder}
                        </div>
                    )}
                    </Droppable>)
                }
            </div>
        </DragDropContext>
    );
};

export default LocationListEditWrapper;