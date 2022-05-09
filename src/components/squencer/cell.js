import styled from "styled-components";

const getBackground = (activated, triggered) => {
  switch (true) {
    case activated && triggered:
      return "#805ad5";
    case activated && !triggered:
      return "#805ad5";
    case !activated && triggered:
      return "#eef";
    default:
      return "#ccc";
  }
};

const Cell = styled.div.attrs(({ activated, triggered }) => ({
  style: {
    background: getBackground(activated, triggered),
  },
}))`
  border-radius: 4px;
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  margin: 2px;
  cursor: pointer;
`;

export default Cell;
