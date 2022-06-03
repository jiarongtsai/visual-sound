import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@emotion/react";
import { colorTheme } from "../motion/colorTheme";
import { MotionWrapper } from "../motion/MotionWrapper";
import { MotionElements } from "../motion/MotionElements";
import { sequenceConfig } from "../../config";

export default function SequencePlayer({
  sheetmusic,
  bpm,
  themeColor,
  isHover,
}) {
  const [playing, setPlaying] = useState(false);
  const [visualEffect, setVisualEffect] = useState(
    sequenceConfig.getVisualEffectState()
  );
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isHover) {
      setPlaying(true);
      return;
    }
    setPlaying(false);
  }, [isHover]);

  useEffect(() => {
    sheetmusic && setSequence(JSON.parse(sheetmusic));
  }, [sheetmusic]);

  useEffect(() => {
    const timeOutspeed = (60 / sequenceConfig.meterPerMeasure / bpm) * 1000;
    const timer = setTimeout(() => {
      if (playing) {
        setCurrentStep((currentStep + 1) % sequenceConfig.steps);
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
          const alphabeta = sequenceConfig.lineMap[i];
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
