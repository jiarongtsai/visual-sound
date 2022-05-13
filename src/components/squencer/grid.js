import { useState, useEffect } from "react";
import Frame from "./frame";
import Cell from "./cell";
const Grid = ({ sequence, toggleStep, currentPage }) => {
  const [curItems, setCurItems] = useState([]);
  const countPerPage = 9;

  useEffect(() => {
    const currentSequence = sequence.slice(
      countPerPage * currentPage - 9,
      countPerPage * currentPage
    );

    setCurItems(currentSequence);
  }, [currentPage, sequence]);

  return (
    <Frame rows={curItems.length} columns={16}>
      {curItems.map((line, i) =>
        line.map((_, j) => (
          <Cell
            key={i + j}
            column={j + 1}
            row={i + 1}
            activated={curItems[i][j]["activated"]}
            triggered={curItems[i][j]["triggered"]}
            onClick={() => toggleStep(i, j)}
          />
        ))
      )}
    </Frame>
  );
};

export default Grid;
