import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { colorTheme } from "../motion/colorTheme";
import { MotionWrapper } from "../motion/MotionWrapper";
import { MotionElements } from "../motion/MotionElements";

//sequence
const steps = 16;
const meterPerMeasure = 4; //一小節分成幾拍
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const initialVisualEffectState = initialVisualEffect(lineMap, false);

function initialVisualEffect(arr, fill) {
  const obj = {};
  arr.forEach((key) => (obj[key] = fill));
  return obj;
}

export default function SequencePlayer({ sheetmusic, bpm, themeColor }) {
  const [playing, setPlaying] = useState(false);
  const [visualEffect, setVisualEffect] = useState(initialVisualEffectState);
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    sheetmusic && setSequence(JSON.parse(sheetmusic));
  }, [sheetmusic]);

  useEffect(() => {
    const timeOutspeed = (60 / meterPerMeasure / bpm) * 1000;
    const timer = setTimeout(() => {
      if (playing) {
        setCurrentStep((currentStep + 1) % steps);
        playSequence(currentStep);
      }
    }, timeOutspeed);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, playing]);

  const playSequence = (currentStep) => {
    for (let i = 0; i < sequence.length; i++) {
      for (let j = 0; j < sequence[i].length; j++) {
        if (sequence[i][j] && j === currentStep) {
          const alphabeta = lineMap[i];
          setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
        }
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={colorTheme[themeColor] || colorTheme["purple"]}>
        <MotionWrapper>
          <MotionElements
            visualEffect={visualEffect}
            setVisualEffect={setVisualEffect}
          />
        </MotionWrapper>
      </ThemeProvider>
    </>
  );
}
