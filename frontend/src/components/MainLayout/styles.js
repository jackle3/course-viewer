import { styled } from "styled-components";

export const MainContainer = styled.div`
  display: flex;
  padding: 16px;
  position: fixed;

  width: 100%;
  height: 100%;

  gap: 20px;
`;

export const GooseContainer = styled.iframe`
  align-self: stretch;
  flex: 0.8;

  border: 1px solid #d3d3d3;
  border-radius: 8px;
`;

export const ContentContainer = styled.div`
  align-self: stretch;
  flex: 1;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  padding: 8px;

  overflow: scroll;
`;

export const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 4px;

  > p {
    margin: 0;
    font-size: 12px;
    font-weight: 600;

    &:last-child {
      font-size: 10px;
    }
  }

  > span {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
  }

  ${({ color }) => `
  background-color: ${color};`}

  ${({ borderColor }) => `
  border-color: ${borderColor};`}
`;
