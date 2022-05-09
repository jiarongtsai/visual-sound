import React, { useState, useEffect, createRef } from "react";
import { useTransition } from "react-spring";
import {
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  CloseButton,
  Slide,
  Box,
  Fade,
  IconButton,
  HStack,
  Text,
  Heading,
  Image,
} from "@chakra-ui/react";
import styled, { ThemeProvider } from "styled-components";
import { useScreenshot } from "../customHook/useScreenshot";
import Grid from "./grid";
import UploadModal from "../UploadModal";
import { Wrapper, Square, Ellipse, Triangle } from "../visual/VisualElement";
import { colorTheme } from "../visual/colorTheme";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipStartFill,
  BsFillRecordFill,
  BsFillStopFill,
  BsArrowCounterclockwise,
  BsFillCameraFill,
  BsBoxArrowUp,
} from "react-icons/bs";

import BPMController from "./BPMController";
import { getValue } from "@testing-library/user-event/dist/utils";

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
  const {
    isOpen: isControllerOpen,
    onOpen: onControllerOpen,
    onClose: onControllerClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = createRef(null);
  const [image, setImage, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current);

  const [isUploaded, setIsUploaded] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [themeColor, setThemeColor] = useState("main");

  const [boomEffect, setBoomEffect] = useState(false);
  const [clapEffect, setClapEffect] = useState(false);
  const [hihatEffect, setHihatEffect] = useState(false);
  const [kickEffect, setKickEffect] = useState(false);
  const [openhatEffect, setOpenhatEffect] = useState(false);
  const [rideEffect, setRideEffect] = useState(false);
  const [snareEffect, setSnareEffect] = useState(false);
  const [tomEffect, setTomEffect] = useState(false);
  const [tinkEffect, setTinkEffect] = useState(false);

  const [BPMValue, setBPMValue] = useState(120);
  const [sequence, setSequence] = useState(initialState);
  const [currentStep, setCurrentStep] = useState(0);

  //visual
  const useKeyboardBindings = (map) => {
    useEffect(() => {
      const handlePress = (event) => {
        const handler = map[event.key];
        if (typeof handler === "function" && !isOpen) {
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
    " ": () => setPlaying((v) => !v),
    1: () => setThemeColor("main"),
    2: () => setThemeColor("energe"),
    3: () => setThemeColor("macaroon"),
    4: () => setThemeColor("neon"),
    5: () => setThemeColor("vintage"),
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
    onRest: () => setBoomEffect(false),
  });

  const clapTransition = useTransition(clapEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: -1000, y: -100, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: 0, opacity: 0.8, transform: "rotate(3.5turn)" },
    leave: { x: 1000, y: -100, opacity: 0, transform: "rotate(1turn)" },
    onRest: () => setClapEffect(false),
  });

  const hihatTransition = useTransition(hihatEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: 0, y: 500, opacity: 0 },
    enter: { x: -300, y: 0, opacity: 0.8 },
    leave: { x: 0, y: 500, opacity: 0 },
    onRest: () => setHihatEffect(false),
  });

  const kickTransition = useTransition(kickEffect, {
    from: { x: -400, y: 100, opacity: 0, transform: "scale(0)" },
    enter: { x: -200, y: 100, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 0, y: 100, opacity: 0, transform: "scale(0)" },
    onRest: () => setKickEffect(false),
  });

  const openhatTransition = useTransition(openhatEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: -1000, y: -1000, opacity: 0, transform: "scale(2)" },
    enter: { x: -100, y: -50, opacity: 0.8, transform: "scale(4)" },
    leave: { x: 1000, y: 1000, opacity: 0, transform: "scale(2)" },
    onRest: () => setOpenhatEffect(false),
  });

  const rideTransition = useTransition(rideEffect, {
    from: { x: -100, y: 1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: -100, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 100, y: 1000, opacity: 0, transform: "rotate(9.5turn)" },
    onRest: () => setRideEffect(false),
  });

  const snareTransition = useTransition(snareEffect, {
    from: { x: -1000, y: 300, opacity: 0 },
    enter: { x: 100, y: 50, opacity: 0.8 },
    leave: { x: 1000, y: 300, opacity: 0 },
    onRest: () => setSnareEffect(false),
  });

  const tomTransition = useTransition(tomEffect, {
    config: { mass: 1, tension: 100, friction: 18 },
    from: { x: -100, y: 1000, opacity: 0, transform: "scale(0)" },
    enter: { x: 100, y: 100, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 300, y: 1000, opacity: 0, transform: "scale(0)" },
    onRest: () => setTomEffect(false),
  });

  const tinkTransition = useTransition(tinkEffect, {
    from: { x: 300, y: 500, opacity: 0 },
    enter: { x: 200, y: 50, opacity: 0.8 },
    leave: { x: 300, y: 500, opacity: 0 },
    onRest: () => setTinkEffect(false),
  });

  useEffect(() => {
    const timeOutspeed = (15 / BPMValue) * 1000;
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
      setBPMValue(120);
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

  return (
    <>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        sequence={sequence}
        bpm={BPMValue}
        setIsUploaded={setIsUploaded}
        image={image}
        setImage={setImage}
        themeColor={themeColor}
      />
      <Flex
        direction={"column"}
        w="80vw"
        h="80vh"
        mt={24}
        mx="auto"
        justify="center"
        align="center"
      >
        <ThemeProvider theme={colorTheme[themeColor]}>
          <Wrapper ref={ref}>
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
        <Flex justify="center" align="center" my={3}>
          <Button
            onClick={onOpen}
            colorScheme="purple"
            leftIcon={<BsBoxArrowUp />}
            mr={4}
          >
            upload
          </Button>
          <Button
            onClick={getImage}
            colorScheme="purple"
            leftIcon={<BsFillCameraFill />}
          >
            screenshot
          </Button>
        </Flex>
        {image && (
          <Image
            w="20vw"
            src={image}
            alt={"Screenshot"}
            position="absolute"
            right="10px"
            bottom="10px"
          />
        )}
        <Button
          w="100vw"
          position="fixed"
          bottom="0"
          left="0"
          variant="ghost"
          onClick={onControllerOpen}
          onMouseEnter={onControllerOpen}
          style={{ zIndex: 199 }}
        >
          Show Edit Panel
        </Button>

        <Fade in={isControllerOpen}>
          <Box
            w="100vw"
            h="100vh"
            bg="blackAlpha.600"
            position="fixed"
            top="0"
            left="0"
            pointerEvents="none"
          />
        </Fade>
        <Slide direction="bottom" in={isControllerOpen} style={{ zIndex: 299 }}>
          <Box
            py={5}
            px={10}
            rounded="md"
            shadow="base"
            onMouseLeave={onControllerClose}
            bg={useColorModeValue("white", "gray.600")}
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <CloseButton onClick={onControllerClose} alignSelf="flex-end" />
            <Heading size="md">Editing Panel</Heading>
            <Flex
              direction={["column", "column", "row"]}
              justifyContent={[
                "space-between",
                "space-between",
                "space-around",
              ]}
              w="70%"
              my={4}
              mx="auto"
            >
              <Box mx="auto">
                <Text>Color Theme</Text>
                <HStack spacing={2}>
                  {Object.entries(colorTheme).map(([key, value], i) => {
                    return (
                      <Button
                        opacity={0.9}
                        key={key}
                        bg={value.background}
                        color={value.light}
                        onClick={() => setThemeColor(key)}
                        size="sm"
                        fontSize="md"
                      >
                        {i + 1}
                      </Button>
                    );
                  })}
                </HStack>
              </Box>

              <Box my={[8, 8, 0]} mx="auto">
                <Text>BPM</Text>
                <BPMController BPMValue={BPMValue} setBPMValue={setBPMValue} />
              </Box>
            </Flex>
            <HStack spacing={2}>
              <IconButton
                aria-label="skip to start"
                icon={<BsSkipStartFill />}
                onClick={handleBacktoHead}
              />
              <IconButton
                aria-label="play or pause"
                icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                onClick={() => setPlaying(!playing)}
              />

              <IconButton
                aria-label="clean up"
                icon={<BsArrowCounterclockwise />}
                onClick={handleCleanUp}
              />
            </HStack>
            {/* <IconButton aria-label="record" icon={<BsFillRecordFill />} />
              <IconButton aria-label="stop" icon={<BsFillStopFill />} /> */}
            <Grid sequence={sequence} toggleStep={toggleStep} />
          </Box>
        </Slide>
      </Flex>
    </>
  );
};

export default Sequencer;
