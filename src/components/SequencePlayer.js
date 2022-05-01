import React, { useState, useEffect } from "react";
import { useTransition } from "react-spring";
import { ThemeProvider } from "styled-components";
import { Wrapper, Square, Ellipse, Triangle } from "./visual/VisualElement";
import { colorTheme } from "./visual/colorTheme";

//sequence
const steps = 16;
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const initialCellState = { triggered: false, activated: false };
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

export default function SequencePlayer({
  player,
  sheetmusic,
  bpm,
  themeColor,
}) {
  const [playing, setPlaying] = useState(false);
  const [boomEffect, setBoomEffect] = useState(false);
  const [clapEffect, setClapEffect] = useState(false);
  const [hihatEffect, setHihatEffect] = useState(false);
  const [kickEffect, setKickEffect] = useState(false);
  const [openhatEffect, setOpenhatEffect] = useState(false);
  const [rideEffect, setRideEffect] = useState(false);
  const [snareEffect, setSnareEffect] = useState(false);
  const [tomEffect, setTomEffect] = useState(false);
  const [tinkEffect, setTinkEffect] = useState(false);

  const [sequence, setSequence] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);

  function transformStoredSequence(storedData) {
    if (!storedData) return;
    const storedSequence = JSON.parse(storedData);
    for (let i = 0; i < storedSequence.length; i++) {
      for (let j = 0; j < storedSequence[i].length; j++) {
        const { activated } = storedSequence[i][j];
        storedSequence[i][j] = { activated, triggered: false };
      }
    }
    return storedSequence;
  }
  useEffect(() => {
    sheetmusic && setSequence(transformStoredSequence(sheetmusic));
  }, [sheetmusic]);

  const nextStep = (time) => {
    const sequenceCopy = [...sequence];
    for (let i = 0; i < sequenceCopy.length; i++) {
      for (let j = 0; j < sequenceCopy[i].length; j++) {
        const { triggered, activated } = sequenceCopy[i][j];
        sequenceCopy[i][j] = { activated, triggered: j === time };
        if (triggered && activated) {
          player.player(lineMap[i]).start();
          switch (lineMap[i]) {
            case "a":
              setBoomEffect((v) => !v);
              break;
            case "s":
              setClapEffect((v) => !v);
              break;
            case "d":
              setHihatEffect((v) => !v);
              break;
            case "f":
              setKickEffect((v) => !v);
              break;
            case "g":
              setOpenhatEffect((v) => !v);
              break;
            case "h":
              setRideEffect((v) => !v);
              break;
            case "j":
              setSnareEffect((v) => !v);
              break;
            case "k":
              setTomEffect((v) => !v);
              break;
            case "l":
              setTinkEffect((v) => !v);
              break;
            default:
              return;
          }
        }
      }
    }
    setSequence(sequenceCopy);
  };

  const boomTransition = useTransition(boomEffect, {
    config: { mass: 1, tension: 10, friction: 4 },
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 0.5, transform: "scale(4)" },
    leave: { opacity: 0, transform: "scale(0)" },
  });

  const clapTransition = useTransition(clapEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: -1000, y: -100, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: 0, opacity: 0.8, transform: "rotate(3.5turn)" },
    leave: { x: 1000, y: -100, opacity: 0, transform: "rotate(1turn)" },
  });

  const hihatTransition = useTransition(hihatEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: 0, y: 500, opacity: 0 },
    enter: { x: -300, y: 0, opacity: 0.8 },
    leave: { x: 0, y: 500, opacity: 0 },
  });

  const kickTransition = useTransition(kickEffect, {
    from: { x: -400, y: 100, opacity: 0, transform: "scale(0)" },
    enter: { x: -200, y: 100, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 0, y: 100, opacity: 0, transform: "scale(0)" },
  });

  const openhatTransition = useTransition(openhatEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: -1000, y: -1000, opacity: 0, transform: "scale(2)" },
    enter: { x: -100, y: -50, opacity: 0.8, transform: "scale(4)" },
    leave: { x: 1000, y: 1000, opacity: 0, transform: "scale(2)" },
  });

  const rideTransition = useTransition(rideEffect, {
    from: { x: -100, y: 1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: -100, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 100, y: 1000, opacity: 0, transform: "rotate(9.5turn)" },
  });

  const snareTransition = useTransition(snareEffect, {
    from: { x: -1000, y: 300, opacity: 0 },
    enter: { x: 100, y: 50, opacity: 0.8 },
    leave: { x: 1000, y: 300, opacity: 0 },
  });

  const tomTransition = useTransition(tomEffect, {
    config: { mass: 1, tension: 100, friction: 18 },
    from: { x: -100, y: 1000, opacity: 0, transform: "scale(0)" },
    enter: { x: 100, y: 100, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 300, y: 1000, opacity: 0, transform: "scale(0)" },
  });

  const tinkTransition = useTransition(tinkEffect, {
    from: { x: 300, y: 500, opacity: 0 },
    enter: { x: 200, y: 50, opacity: 0.8 },
    leave: { x: 300, y: 500, opacity: 0 },
  });

  useEffect(() => {
    const timeOutspeed = (15 / bpm) * 1000;
    const timer = setTimeout(() => {
      if (playing) {
        setCurrentStep((currentStep + 1) % steps);
        nextStep(currentStep);
      }
    }, timeOutspeed);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, playing]);

  return (
    <>
      <ThemeProvider theme={colorTheme[themeColor] || colorTheme.themeDefault}>
        <Wrapper>
          {boomTransition((style, item) =>
            item ? <Ellipse style={style} /> : ""
          )}
          {clapTransition((style, item) =>
            item ? <Triangle style={style} /> : ""
          )}
          {hihatTransition((style, item) =>
            item ? <Triangle style={style} /> : ""
          )}
          {kickTransition((style, item) =>
            item ? <Square style={style} /> : ""
          )}
          {openhatTransition((style, item) =>
            item ? <Triangle style={style} /> : ""
          )}
          {rideTransition((style, item) =>
            item ? <Square style={style} /> : ""
          )}
          {snareTransition((style, item) =>
            item ? <Square style={style} /> : ""
          )}
          {tomTransition((style, item) =>
            item ? <Ellipse style={style} /> : ""
          )}
          {tinkTransition((style, item) =>
            item ? <Triangle style={style} /> : ""
          )}
        </Wrapper>
      </ThemeProvider>
      <button onClick={() => setPlaying(!playing)}>{`${
        playing ? "pause" : "play"
      }`}</button>
    </>
  );
}
