import React from "react";
import { Droppable } from "react-beautiful-dnd";
import {
  ColumnContainer,
  ColumnTitle,
  QuarterBox,
  QuarterDropZone,
  QuarterTitle,
  QuarterTotals,
} from "./styles";
import CourseItem from "./courseItem";

const Column = ({ columnTitle, cells, data, search, onDelete }) => {
  const calculateTotals = (courses) => {
    let unitsMaxTotal = 0;
    let hoursTotal = 0;

    for (const course of courses) {
      const hours = course.course.hours;
      const unitsMax = course.course.unitsMax;
      if (unitsMax) {
        unitsMaxTotal += Math.max(0, unitsMax);
      }
      if (hours) {
        hoursTotal += Math.max(0, hours);
      }
    }

    const numClasses = courses.length;

    return { numClasses, unitsMaxTotal, hoursTotal };
  };

  const renderCell = (cellId) => {
    const cell = data[cellId];
    const { numClasses, unitsMaxTotal, hoursTotal } = calculateTotals(cell.items);

    return (
      <Droppable droppableId={cellId} key={cellId}>
        {(provided, snapshot) => (
          <QuarterBox>
            <QuarterTitle>
              <span>{cell.name}</span>
              <QuarterTotals>
                {numClasses} classes | {unitsMaxTotal} units | {hoursTotal} hours
              </QuarterTotals>
            </QuarterTitle>
            <QuarterDropZone
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {cell.items.map((item, index) => (
                <CourseItem item={item} index={index} onDelete={onDelete} search={search} />
              ))}
              {provided.placeholder}
            </QuarterDropZone>
          </QuarterBox>
        )}
      </Droppable>
    );
  };

  return (
    <ColumnContainer>
      <ColumnTitle>{columnTitle}</ColumnTitle>
      {cells.map((cellId) => renderCell(cellId))}
    </ColumnContainer>
  );
};

export default Column;
