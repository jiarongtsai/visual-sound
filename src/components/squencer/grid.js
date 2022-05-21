import { useState, useEffect } from "react";
import Frame from "./frame";
import Cell from "./cell";
const Grid = ({
  sequence,
  toggleStep,
  currentPage,
  currentStep,
  toggleLine,
}) => {
  const [currentItems, setCurrentItems] = useState([]);
  const countPerPage = 9;

  useEffect(() => {
    const currentSequence = sequence.slice(
      countPerPage * currentPage - 9,
      countPerPage * currentPage
    );

    setCurrentItems(currentSequence);
  }, [currentPage, sequence]);

  return (
    <Frame rows={currentItems.length} columns={currentItems[0]?.length}>
      {currentItems.map((line, i) =>
        line.map((_, j) => (
          <Cell
            key={i + j}
            column={j + 1}
            row={i + 1}
            activated={currentItems[i][j]}
            triggered={toggleLine === i}
            currentPlay={currentStep === j}
            onClick={() => toggleStep(i, j)}
          />
        ))
      )}
    </Frame>
  );
};

export default Grid;
