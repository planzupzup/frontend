import React, { use, useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Day, Location } from '@/app/plan/[planId]/page';
import LocationItem from './LocationItem';

type TProps = {
    totalLocationList : Location[][];
    setTotalLocationList : React.Dispatch<React.SetStateAction<Location[][]>>;
}

const LocationListEditWrapper = ({ totalLocationList, setTotalLocationList} : TProps) => {

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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '8px' }}>
            {totalLocationList.filter(column => column.length > 0).map((column, columnIndex) => 
                <Droppable droppableId={`${columnIndex}`} key={columnIndex}>
                {(provided) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        backgroundColor: '#f0f0f0',
                        padding: '8px',
                        width: '250px',
                        minHeight: '500px',
                        borderRadius: '4px',
                    }}
                    >
                    <h3>{columnIndex + 1}</h3>
                    {column.map((location, index) => {
                        return <Draggable
                        key={location.locationId}
                        draggableId={`${location.locationId}`}
                        index={index}
                        >
                        {(provided) => (
                            <div ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                                <LocationItem location={location} locationIndex={index + 1}/>
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