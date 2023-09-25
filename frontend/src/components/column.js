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
      const actualHours = hours ? hours <= 0 ? (unitsMax <= 0 ? -1 : unitsMax * 3) : hours : 0;
      if (unitsMax) {
        unitsMaxTotal += Math.max(0, unitsMax);
      }
      if (actualHours) {
        hoursTotal += Math.max(0, actualHours);
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
