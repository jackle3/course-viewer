import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { GridBoard } from "./styles";
import Column from "./column";
import UnplannedColumn from "./unplannedColumn";
import { v4 as uuid } from "uuid";
import apiRequest from "../helpers/apiRequest";

const grid = {
  "1A": { name: "Search", items: [] },
  "1B": { name: "Unplanned", items: [] },
  "2A": { name: "Soph Fall", items: [] },
  "2B": { name: "Soph Winter", items: [] },
  "2C": { name: "Soph Spring", items: [] },
  "3A": { name: "Junior Fall", items: [] },
  "3B": { name: "Junior Winter", items: [] },
  "3C": { name: "Junior Spring", items: [] },
  "4A": { name: "Senior Fall", items: [] },
  "4B": { name: "Senior Winter", items: [] },
  "4C": { name: "Senior Spring", items: [] },
};

function Planner() {
  const [cells, setCells] = useState(grid);
  const columnsData = [
    { title: "Sophomore", cells: ["2A", "2B", "2C"] },
    { title: "Junior", cells: ["3A", "3B", "3C"] },
    { title: "Senior", cells: ["4A", "4B", "4C"] },
  ];

  // Function to save data to local storage
  const saveToLocalStorage = (data) => {
    try {
      // Exclude the "1A" box from the saved data.
      const dataToSave = { ...data };
      delete dataToSave["1A"];

      localStorage.setItem("courseData", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving data to local storage:", error);
    }
  };

  // Function to load data from local storage
  const loadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem("courseData");
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error loading data from local storage:", error);
      return null;
    }
  };

  // Initialize state with loaded data from local storage
  useEffect(() => {
    const loadedData = loadFromLocalStorage();
    if (loadedData) {
      // Merge the loaded data with the default 1A box.
      setCells({
        "1A": grid["1A"], // Default 1A box
        ...loadedData, // Loaded data
      });
    }
  }, []);

  const handleSearch = async (classCode) => {
    if (!classCode) {
      setCells((prevCells) => ({
        ...prevCells,
        "1A": {
          ...prevCells["1A"],
          items: [],
        },
      }));
      return;
    }

    try {
      const response = await apiRequest("GET", `/courses/${classCode}`);

      const filteredCourses = response.filter(
        (course) => course.sections && course.sections.length > 0
      );

      const updatedCells = {
        ...cells,
        "1A": {
          ...cells["1A"],
          items: filteredCourses.map((course) => ({
            id: uuid(),
            course: course,
          })),
        },
      };

      // Update the state with the new data
      setCells(updatedCells);

      // Save the updated data to local storage
      saveToLocalStorage(updatedCells);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onDelete = (itemId) => {
    // Create a deep copy of the current state
    const newCells = JSON.parse(JSON.stringify(cells));

    // Iterate through cells and remove the course item with the specified itemId
    for (const cellId in newCells) {
      newCells[cellId].items = newCells[cellId].items.filter(
        (item) => item.id !== itemId
      );
    }

    // Update state with the modified cells
    setCells(newCells);

    // Update local storage with the modified state
    saveToLocalStorage(newCells);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If the item was dropped in the same place it started, no action is needed.
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Creating a deep copy of the current state to avoid mutations.
    const newCells = JSON.parse(JSON.stringify(cells));

    // Extracting the dragged item.
    const [draggedItem] = newCells[source.droppableId].items.splice(
      source.index,
      1
    );

    if (source.droppableId === destination.droppableId) {
      // The item was dropped in the same cell. Just need to reorder the items within the cell.
      newCells[source.droppableId].items.splice(
        destination.index,
        0,
        draggedItem
      );
    } else {
      // The item was dropped in a different cell.
      newCells[destination.droppableId].items.splice(
        destination.index,
        0,
        draggedItem
      );
    }

    // Update the state and save to local storage
    setCells(newCells);
    saveToLocalStorage(newCells);
  };

  return (
    <GridBoard>
      <DragDropContext onDragEnd={onDragEnd}>
        <UnplannedColumn
          columnTitle="Planning"
          data={cells}
          handleSearch={handleSearch}
          onDelete={onDelete}
        />
        {columnsData.map((column) => (
          <Column
            key={column.title}
            columnTitle={column.title}
            cells={column.cells}
            data={cells}
            onDelete={onDelete}
          />
        ))}
      </DragDropContext>
    </GridBoard>
  );
}

export default Planner;
