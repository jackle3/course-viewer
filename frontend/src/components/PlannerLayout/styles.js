import styled from "styled-components";
import { Popover } from "antd";

export const GridBoard = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 8px;

  background-color: #121212;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  flex: 1;

  gap: 8px;
`;

export const ColumnTitle = styled.h2`
  color: #bb86fc;
  margin: 8px;
  user-select: none;
`;

export const QuarterBox = styled.div`
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;

  align-self: stretch;
  flex: 2;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
`;

export const QuarterDropZone = styled.div`
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;

  ${(props) => props.isDraggingOver && `background-color: #333333`};

  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #2e2e2e;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #777;
  }
`;

export const SearchBox = styled(QuarterBox)`
  flex: 1;
`;

export const QuarterTitle = styled.div`
  color: #e0e0e0;
  background-color: #3a3a3a;
  border-bottom: 2px solid #2a2a2a;
  padding: 8px 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SearchCourseForm = styled.form`
  color: #e0e0e0;
  background-color: #3a3a3a;
  border-bottom: 2px solid #2a2a2a;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  > input {
    font-size: 14px;
    border: none;
    flex: 1;
    background-color: inherit;
    color: inherit;
    padding: 8px 10px;
    font-weight: bold;

    &:focus {
      outline: none;
      box-shadow: none;
      border: none;
    }
  }
`;

export const ResultCount = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #888;
`;

export const CourseContainer = styled.div`
  user-select: none;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  background-color: #2a2a2a;
  ${(props) => props.isDragging && "background-color: #1a1a1a;"};
  font-size: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
`;

export const CourseTitle = styled.div`
  flex: 1;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;

  > span {
    font-weight: 600;
    font-size: 14px;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 3px;
  width: 100%;
  height: 100%;

  flex: 0;
`;

export const Stat = styled.div`
  width: 30px;
  font-weight: 500;
  border-radius: 4px;
  color: #1e1e1e;
  display: flex;
  justify-content: center;
  background-color: lightgrey;

  ${(props) =>
    props.color &&
    `
  background-color: ${props.color}`}
`;

export const QuarterIndicator = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

export const QuarterLetter = styled.span`
  font-size: 10px;
  line-height: 100%;
  font-weight: bold;

  &.AUT {
    color: #b695c0;
  }

  &.WIN {
    color: #8470ff;
  }

  &.SPR {
    color: #87ceeb;
  }
`;

export const QuarterTotals = styled.div`
  font-size: 12px;
  color: #888;
`;

export const PopoverContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  max-height: 250px;
  overflow-y: auto;
  gap: 4px;
  color: #e0e0e0;
`;

export const PopoverTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > h1 {
    margin: 0;
  }
`;

export const PopoverGERS = styled.p`
  margin: 0;
  &:first-of-type {
    font-weight: bold;
  }
`;

export const PopoverDescription = styled.p`
  margin: 0;
  max-height: 150px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: #2e2e2e;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #777;
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  gap: 4px;

  > a {
    color: #66c2ff;
  }
`;
