import styled from "styled-components";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  justify-items: center;
  justify-content: center;
  gap: 1rem;
  width: 90vw;
  margin: 0 auto;
`;

const Square = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: blue;
  overflow: hidden;
  object-position: 50% 50%;
  pointer-events: none;
`;

export { GridWrapper, Square };
