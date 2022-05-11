import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { Wrapper } from "./visual/VisualElement";
import { colorTheme } from "./visual/colorTheme";
import { BoomTransition } from "./visual/BoomTransition";
import { ClapTransition } from "./visual/ClapTransition";
import { HihatTransition } from "./visual/HihatTransition";
import { KickTransition } from "./visual/KickTransition";
import { OpenhatTransition } from "./visual/OpenhatTransition";
import { RideTransition } from "./visual/RideTransition";
import { SnareTransition } from "./visual/SnareTransition";
import { TomTransition } from "./visual/TomTransition";
import { TinkTransition } from "./visual/TinkTransition";

//sequence
const steps = 16;
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const initialCellState = { triggered: false, activated: false };
const initialState = [
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
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
      <ThemeProvider theme={colorTheme[themeColor] || colorTheme.main}>
        <Wrapper>
          <BoomTransition effect={boomEffect} setEffect={setBoomEffect} />
          <KickTransition effect={kickEffect} setEffect={setKickEffect} />
          <TomTransition effect={tomEffect} setEffect={setTomEffect} />
          <ClapTransition effect={clapEffect} setEffect={setClapEffect} />
          <HihatTransition effect={hihatEffect} setEffect={setHihatEffect} />
          <OpenhatTransition
            effect={openhatEffect}
            setEffect={setOpenhatEffect}
          />
          <RideTransition effect={rideEffect} setEffect={setRideEffect} />
          <SnareTransition effect={snareEffect} setEffect={setSnareEffect} />
          <TinkTransition effect={tinkEffect} setEffect={setTinkEffect} />
        </Wrapper>
      </ThemeProvider>
      <button onClick={() => setPlaying(!playing)}>{`${
        playing ? "pause" : "play"
      }`}</button>
    </>
  );
}
