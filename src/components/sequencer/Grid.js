import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Frame from "./Frame";
import Cell from "./Cell";
import { useMediaQuery } from "@chakra-ui/react";
const Grid = ({
  sequence,
  toggleStep,
  currentPage,
  currentStep,
  toggleLine,
}) => {
  const [currentItems, setCurrentItems] = useState([]);
  const countPerPage = 9;
  const [breakPoint] = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const currentSequence = sequence.slice(
      countPerPage * currentPage - countPerPage,
      countPerPage * currentPage
    );
    setCurrentItems(currentSequence);
  }, [currentPage, sequence]);

  return (
    <Frame
      rows={currentItems.length}
      columns={
        breakPoint ? currentItems[0]?.length / 2 : currentItems[0]?.length
      }
    >
      {currentItems.map((line, i) =>
        line.map((_, j) => {
          return breakPoint ? (
            j % 2 === 0 && (
              <Cell
                key={i + j}
                column={breakPoint ? Math.ceil(j / 2) : j + 1}
                row={i + 1}
                activated={currentItems[i][j]}
                triggered={toggleLine === i + (currentPage - 1) * 9}
                currentPlay={currentStep === j}
                onClick={() => toggleStep(i, j)}
              />
            )
          ) : (
            <Cell
              key={i + j}
              column={j + 1}
              row={i + 1}
              activated={currentItems[i][j]}
              triggered={toggleLine === i + (currentPage - 1) * 9}
              currentPlay={currentStep === j}
              onClick={() => toggleStep(i, j)}
            />
          );
        })
      )}
    </Frame>
  );
};

export default Grid;

Grid.propTypes = {
  sequence: PropTypes.arrayOf(PropTypes.array),
  toggleStep: PropTypes.func,
  currentPage: PropTypes.number,
  currentStep: PropTypes.number,
  toggleLine: PropTypes.number,
};
