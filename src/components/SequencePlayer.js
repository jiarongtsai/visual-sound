import React, { useState, useEffect } from "react";
import { IconButton, Image } from "@chakra-ui/react";
import { BsPlayCircle, BsPauseCircle } from "react-icons/bs";
import { ThemeProvider } from "styled-components";
import { MotionWrapper } from "./visual/MotionWrapper";
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
import usePlayer from "./usePlayer";
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

export default function SequencePlayer({
  imageUrl,
  sheetmusic,
  bpm,
  themeColor,
}) {
  const [playing, setPlaying] = useState(false);
  const [visualEffect, setVisualEffect] = useState(initialVisualEffectState);
  const [sequence, setSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHover, setIsHover] = useState(true);
  const player = usePlayer();

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
          player.player(alphabeta).start();
          setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
        }
      }
    }
  };

  return (
    <>
      <ThemeProvider theme={colorTheme[themeColor]}>
        <MotionWrapper
          // disable hover effect when playing
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => setPlaying(!playing)}
        >
          {isHover ? (
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
          ) : (
            ""
          )}
          {/* fixme */}
          {!playing && imageUrl ? (
            <Image w="100%" maxH="564px" objectFit="cover" src={imageUrl} />
          ) : (
            ""
          )}
          <BoomTransition
            alphabeta="a"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <KickTransition
            alphabeta="f"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <TomTransition
            alphabeta="k"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <ClapTransition
            alphabeta="s"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <HihatTransition
            alphabeta="d"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <OpenhatTransition
            alphabeta="g"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <RideTransition
            alphabeta="h"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <SnareTransition
            alphabeta="j"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
          <TinkTransition
            alphabeta="k"
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
        </MotionWrapper>
      </ThemeProvider>
    </>
  );
}
