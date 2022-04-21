import React, { useState, useEffect } from "react";
import { useTransition } from "react-spring";
import styled, { ThemeProvider } from "styled-components";
import Grid from "./grid";
import UploadModal from "../UploadModal";
import {
  Wrapper,
  Square,
  Ellipse,
  Triangle,
  themeDefault,
  energe,
  macaroon,
  neon,
  vintage,
} from "../visualElement/VisualElement";

//sequence
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

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;

const Sequencer = ({ player }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [themeColor, setThemeColor] = useState(themeDefault);

  const [boomEffect, setBoomEffect] = useState(false);
  const [clapEffect, setClapEffect] = useState(false);
  const [hihatEffect, setHihatEffect] = useState(false);
  const [kickEffect, setKickEffect] = useState(false);
  const [openhatEffect, setOpenhatEffect] = useState(false);
  const [rideEffect, setRideEffect] = useState(false);
  const [snareEffect, setSnareEffect] = useState(false);
  const [tomEffect, setTomEffect] = useState(false);
  const [tinkEffect, setTinkEffect] = useState(false);

  const [bpm, setBpm] = useState(120);
  const [sequence, setSequence] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  //visual
  const useKeyboardBindings = (map) => {
    useEffect(() => {
      const handlePress = (event) => {
        const handler = map[event.key];
        if (typeof handler === "function" && !openModal) {
          handler();
        }
      };

      window.addEventListener("keydown", handlePress);

      return () => {
        window.removeEventListener("keydown", handlePress);
      };
    }, [map]);
  };

  const toggleStep = (line, step) => {
    const sequenceCopy = [...sequence];
    const { triggered, activated } = sequenceCopy[line][step];
    sequenceCopy[line][step] = { triggered, activated: !activated };
    setSequence(sequenceCopy);
    if (!playing) {
      player.player(lineMap[line]).start();
      switch (lineMap[line]) {
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
  };

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

  useKeyboardBindings({
    1: () => setThemeColor(themeDefault),
    2: () => setThemeColor(energe),
    3: () => setThemeColor(macaroon),
    4: () => setThemeColor(neon),
    5: () => setThemeColor(vintage),
    a: () => {
      if (!playing) {
        player.player("a").start();
        setBoomEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("a"), currentStep);
    },
    s: () => {
      if (!playing) {
        player.player("s").start();
        setClapEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("s"), currentStep);
    },
    d: () => {
      if (!playing) {
        player.player("d").start();
        setHihatEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("d"), currentStep);
    },
    f: () => {
      if (!playing) {
        player.player("f").start();
        setKickEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("f"), currentStep);
    },
    g: () => {
      if (!playing) {
        player.player("g").start();
        setOpenhatEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("g"), currentStep);
    },
    h: () => {
      if (!playing) {
        player.player("h").start();
        setRideEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("h"), currentStep);
    },
    j: () => {
      if (playing) {
        player.player("j").start();
        setSnareEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("j"), currentStep);
    },
    k: () => {
      if (!playing) {
        player.player("k").start();
        setTomEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("k"), currentStep);
    },
    l: () => {
      if (!playing) {
        player.player("l").start();
        setTinkEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("l"), currentStep);
    },
  });

  const boomTransition = useTransition(boomEffect, {
    config: { mass: 1, tension: 10, friction: 4 },
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 0.8, transform: "scale(4)" },
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

  useEffect(() => {
    if (isUploaded) {
      handleCleanUp();
      setBpm(120);
      setCurrentStep(0);
      setBoomEffect(false);
      setClapEffect(false);
      setHihatEffect(false);
      setKickEffect(false);
      setOpenhatEffect(false);
      setRideEffect(false);
      setSnareEffect(false);
      setTomEffect(false);
      setTinkEffect(false);
      setIsUploaded(false);
    }
  }, [isUploaded]);

  function handleBacktoHead() {
    setCurrentStep(0);
    if (!playing) nextStep(0);
  }

  function handleCleanUp() {
    const sequenceCopy = [...sequence];
    for (let i = 0; i < sequenceCopy.length; i++) {
      for (let j = 0; j < sequenceCopy[i].length; j++) {
        const { triggered } = sequenceCopy[i][j];
        sequenceCopy[i][j] = { activated: false, triggered };
      }
    }
    setSequence(sequenceCopy);
  }

  function handleSequenceData(currentSequence) {
    for (let i = 0; i < currentSequence.length; i++) {
      for (let j = 0; j < currentSequence[i].length; j++) {
        const { activated } = currentSequence[i][j];
        currentSequence[i][j] = { activated };
      }
    }
    return JSON.stringify(currentSequence);
  }

  return (
    <>
      {openModal ? (
        <UploadModal
          setOpenModal={setOpenModal}
          sequenceJSON={handleSequenceData(sequence)}
          bpm={bpm}
          setIsUploaded={setIsUploaded}
        />
      ) : (
        ""
      )}
      <button onClick={() => setOpenModal(true)}>upload</button>
      <ThemeProvider theme={themeColor}>
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
      <Div>
        <button onClick={handleBacktoHead}>to head</button>
        <button onClick={() => setPlaying(!playing)}>{`${
          playing ? "Pause" : "Play"
        }`}</button>
        <button onClick={handleCleanUp}>clean</button>
      </Div>
      <Div>
        <label>{`BPM = ${bpm}`}</label>
        <input
          type="range"
          min="60"
          max="240"
          value={bpm}
          step="1"
          onChange={(e) => setBpm(e.target.value)}
        />
      </Div>
      <Grid sequence={sequence} toggleStep={toggleStep} />
    </>
  );
};

export default Sequencer;
