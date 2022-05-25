import styled from "@emotion/styled";
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

const Cell = styled.div(
  {
    borderRadius: "4px",
    margin: "2px",
    cursor: "pointer",
  },
  (props) => ({
    gridColumn: props.column,
    gridRow: props.row,
    background: getBackground(props.activated, props.currentPlay),
    opacity: getOpacity(props.triggered),
  })
);

export default Cell;

Cell.propTypes = {
  activated: PropTypes.bool,
  triggered: PropTypes.bool,
  currentPlay: PropTypes.bool,
};
