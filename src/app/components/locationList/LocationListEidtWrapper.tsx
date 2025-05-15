import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Location } from '@/app/plan/[planId]/page';
import LocationItem from './LocationItem';

type TProps = {
    totalLocationList : Location[][];
}

const LocationListEditWrapper = ({ totalLocationList } : TProps) => {
    const [locations, setLocations] = useState<Location[][]>(totalLocationList);

    useEffect(() => {
        console.log("@");
    },[totalLocationList]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) return;

        const sourceIndex = parseInt(source.droppableId, 10);
        const destinationIndex = parseInt(destination.droppableId, 10);

        const sourceColumn = [...locations[sourceIndex]];
        const destColumn = [...locations[destinationIndex]];
        const [moveItem] = sourceColumn.splice(source.index, 1);

        const newLocations = [...locations];

        if (sourceIndex === destinationIndex) {
            sourceColumn.splice(destination.index, 0, moveItem);
            newLocations[sourceIndex] = sourceColumn;
        } else {
            destColumn.splice(destination.index, 0, moveItem);
            newLocations[sourceIndex] = sourceColumn;
            newLocations[destinationIndex]= destColumn;
        }

        setLocations(newLocations);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '8px' }}>
            {locations.map((column, columnIndex) => 
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
                    {column.map((location, index) => 
                        <Draggable
                        key={location.id}
                        draggableId={`${location.id}`}
                        index={index}
                        >
                        {(provided) => (
                            <div ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                                <LocationItem location={location} />
                            </div>
                        )}
                        </Draggable>
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