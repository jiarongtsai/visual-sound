import styled from "styled-components";
import PropTypes from "prop-types";
const getBackground = (activated, currentPlay) => {
  if (activated) return "#805ad5";
  if (currentPlay) return "#eef";

  return "#ccc";
};

const getOpacity = (triggered) => {
  if (triggered) return 0.7;
  return 1;
};

const Cell = styled.div.attrs(({ activated, triggered, currentPlay }) => ({
  style: {
    background: getBackground(activated, currentPlay),
    opacity: getOpacity(triggered),
  },
}))`
  border-radius: 4px;
  grid-column: ${(props) => props.column};
  grid-row: ${(props) => props.row};
  margin: 2px;
  cursor: pointer;
`;

export default Cell;

Cell.propTypes = {
  activated: PropTypes.bool,
  triggered: PropTypes.bool,
  currentPlay: PropTypes.bool,
};
