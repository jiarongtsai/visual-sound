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
      return "#f9f9f9";
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
`;

export default Cell;
