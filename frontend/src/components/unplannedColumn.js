import React from "react";
import { Droppable } from "react-beautiful-dnd";
import {
  ColumnContainer,
  ColumnTitle,
  QuarterBox,
  QuarterDropZone,
  QuarterTitle,
  SearchCourseForm,
  ResultCount,
  SearchBox,
} from "./styles";
import debounce from "lodash.debounce";

import { useMemo, useEffect } from "react";
import CourseItem from "./courseItem";

function UnplannedColumn({ columnTitle, data, handleSearch, onDelete }) {
  // Debounce the handleSearch function
  const debouncedResults = useMemo(() => {
    const handleChange = (e) => {
      handleSearch(e.target.value);
    };

    return debounce(handleChange, 300, { leading: false, trailing: true });
  }, [handleSearch]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const renderSearchBox = () => {
    const cell = data["1A"];

    return (
      <Droppable droppableId={"1A"} key={"1A"} isDropDisabled>
        {(provided, snapshot) => (
          <SearchBox>
            <SearchCourseForm onSubmit={(e) => e.preventDefault()}>
              <input placeholder="Search" onChange={debouncedResults} />
              <ResultCount>{cell?.items.length || 0} results</ResultCount>
            </SearchCourseForm>

            <QuarterDropZone
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {cell?.items.map((item, index) => (
                <CourseItem item={item} index={index} search />
              ))}
              {provided.placeholder}
            </QuarterDropZone>
          </SearchBox>
        )}
      </Droppable>
    );
  };

  const renderUnplannedBox = () => {
    const cell = data["1B"];

    return (
      <Droppable droppableId={"1B"} key={"1B"}>
        {(provided, snapshot) => (
          <QuarterBox>
            <QuarterTitle>Unplanned</QuarterTitle>
            <QuarterDropZone
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {cell.items.map((item, index) => (
                <CourseItem item={item} index={index} onDelete={onDelete} />
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
      {renderSearchBox()}
      {renderUnplannedBox()}
    </ColumnContainer>
  );
}

export default UnplannedColumn;
