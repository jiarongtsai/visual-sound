import React, { useState, useEffect } from "react";
import { IconButton, Image } from "@chakra-ui/react";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import { ThemeProvider } from "@emotion/react";
import { MotionWrapper } from "../motion/MotionWrapper";
import { MotionElements } from "../motion/MotionElements";
import { colorTheme } from "../motion/colorTheme";
import usePlayer from "../../customHook/usePlayer";
//sequence

import { sequenceConfig } from "../../config";

export default function SequencePlayer({
  imageUrl,
  sheetmusic,
  bpm,
  themeColor,
}) {
  const [playing, setPlaying] = useState(false);
  const [visualEffect, setVisualEffect] = useState(
    sequenceConfig.getVisualEffectState()
  );
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHover, setIsHover] = useState(true);
  const player = usePlayer();

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
          player.player(alphabeta).start();
          setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
        }
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={colorTheme[themeColor] || colorTheme["purple"]}>
        <MotionWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => setPlaying(!playing)}
        >
          {isHover && (
            <IconButton
              zIndex="999"
              transform={"scale(3)"}
              position="absolute"
              size="lg"
              w="100%"
              h="100%"
              colorScheme="blackAlpha"
              aria-label="play or pause"
              icon={playing ? <BsPauseCircle /> : <BsPlayCircle />}
              onClick={() => setPlaying(!playing)}
            />
          )}
          {!playing && imageUrl && (
            <Image
              w="100%"
              h="100%"
              maxH="564px"
              objectFit="cover"
              src={imageUrl}
            />
          )}
          <MotionElements
            visualEffect={visualEffect}
            setVisualEffect={setVisualEffect}
          />
        </MotionWrapper>
      </ThemeProvider>
    </>
  );
}
