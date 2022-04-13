import React, { useState, useEffect } from "react";
import Grid from "./grid";

const steps = 16;
const initialCellState = { triggered: false, activated: false };
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const initialState = [
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
  new Array(16).fill(initialCellState),
];

const useKeyboardBindings = (map) => {
  useEffect(() => {
    const handlePress = (event) => {
      const handler = map[event.key];

      if (typeof handler === "function") {
        handler();
      } else {
        return;
      }
    };

    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [map]);
};

const Sequencer = ({ player, playing }) => {
  const [sequence, setSequence] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStep = (line, step) => {
    const sequenceCopy = [...sequence];
    const { triggered, activated } = sequenceCopy[line][step];
    sequenceCopy[line][step] = { triggered, activated: !activated };
    setSequence(sequenceCopy);
    player.player(lineMap[line]).start();
  };

  const nextStep = (time) => {
    for (let i = 0; i < sequence.length; i++) {
      for (let j = 0; j < sequence[i].length; j++) {
        const { triggered, activated } = sequence[i][j];
        sequence[i][j] = { activated, triggered: j === time };
        if (triggered && activated) {
          player.player(lineMap[i]).start();
        }
      }
    }
    setSequence(sequence);
  };

  useKeyboardBindings({
    a: () => {},
    s: () => {},
    d: () => {},
    f: () => {},
    g: () => {},
    h: () => {},
    j: () => {},
    k: () => {},
    l: () => {},
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playing) {
        setCurrentStep((currentStep + 1) % steps);
        nextStep(currentStep);
      }
    }, 100 + Math.random() * 20);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, playing]);

  return (
    <>
      <Grid sequence={sequence} toggleStep={toggleStep} />
    </>
  );
};

export default Sequencer;
