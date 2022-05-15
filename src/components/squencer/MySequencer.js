import React, { useState, useEffect, createRef } from "react";
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
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

import { useSpring, animated } from "react-spring";

import styled, { ThemeProvider } from "styled-components";
import { useScreenshot } from "../customHook/useScreenshot";
import UploadModal from "../UploadModal";
import { Wrapper } from "../visual/VisualElement";
import { colorTheme } from "../visual/colorTheme";
import Grid from "./grid";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipStartFill,
  BsFillRecordFill,
  BsFillStopFill,
  BsArrowCounterclockwise,
  BsFillCameraFill,
  BsBoxArrowUp,
  BsMusicNote,
} from "react-icons/bs";

import { BoomTransition } from "../visual/BoomTransition";
import { ClapTransition } from "../visual/ClapTransition";
import { HihatTransition } from "../visual/HihatTransition";
import { KickTransition } from "../visual/KickTransition";
import { OpenhatTransition } from "../visual/OpenhatTransition";
import { RideTransition } from "../visual/RideTransition";
import { SnareTransition } from "../visual/SnareTransition";
import { TomTransition } from "../visual/TomTransition";
import { TinkTransition } from "../visual/TinkTransition";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

import { Notification } from "../message/Notification";

import BPMController from "./BPMController";
import { IconStack } from "./IconStack";
//sequence
const steps = 16;
const initialCellState = { triggered: false, activated: false };
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
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
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
  Array(16).fill(initialCellState),
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

const Minimal = ({ currentPage, setCurrentPage, pagesCount, pages }) => {
  const currentBackground = useColorModeValue("gray.300", "gray.500");
  return (
    <Pagination
      my={4}
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPrevious>
          <CgChevronLeft />
        </PaginationPrevious>
        <PaginationPageGroup mx={2}>
          {pages.map((page) => (
            <PaginationPage
              w={10}
              key={`pagination_page_${page}`}
              page={page}
              _current={{
                bg: currentBackground,
              }}
            />
          ))}
        </PaginationPageGroup>
        <PaginationNext>
          <CgChevronRight />
        </PaginationNext>
      </PaginationContainer>
    </Pagination>
  );
};

const ChainWrapper = styled(animated.div)`
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
`;

function ChainSpring({ children, open }) {
  const styles = useSpring({
    config: { friction: 50, delay: 3000 },
    loop: open,
    to: [{ y: -8 }, { y: 0 }],
    from: { y: 0 },
  });
  // ...
  return <ChainWrapper style={styles}>{children}</ChainWrapper>;
}

function ScaleSpring({ children, move }) {
  const styles = useSpring({
    config: { friction: 30, delay: 5000 },
    loop: move,
    to: [{ scale: 1.05 }, { scale: 1 }],
    from: { scale: 1 },
  });
  // ...
  return <animated.div style={styles}>{children}</animated.div>;
}
const Sequencer = ({
  player,
  playing,
  setPlaying,
  recording,
  setRecording,
}) => {
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: 3,
    initialState: { currentPage: 1 },
  });
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
  const [screenshotSpring, setScreenshotSpring] = useState(false);
  const [themeColor, setThemeColor] = useState("purple");

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

  const [currentHit, setCurrentHit] = useState("500px");

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
    if (currentPage === 2) line = line + 9;
    if (currentPage === 3) line = line + 18;

    const sequenceCopy = [...sequence];
    const { triggered, activated } = sequenceCopy[line][step];
    sequenceCopy[line][step] = { triggered, activated: !activated };

    setSequence(sequenceCopy);
    if (!recording) {
      player.player(lineMap[line]).start();
      switch (lineMap[line]) {
        case "a":
          setCurrentHit(2 + "px");
          setBoomEffect((v) => !v);
          break;
        case "s":
          setCurrentHit(2 + 40 * 1 + "px");
          setClapEffect((v) => !v);
          break;
        case "d":
          setCurrentHit(2 + 40 * 2 + "px");
          setHihatEffect((v) => !v);
          break;
        case "f":
          setCurrentHit(2 + 40 * 3 + "px");
          setKickEffect((v) => !v);
          break;
        case "g":
          setCurrentHit(2 + 40 * 4 + "px");
          setOpenhatEffect((v) => !v);
          break;
        case "h":
          setCurrentHit(2 + 40 * 5 + "px");
          setRideEffect((v) => !v);
          break;
        case "j":
          setCurrentHit(2 + 40 * 6 + "px");
          setSnareEffect((v) => !v);
          break;
        case "k":
          setCurrentHit(2 + 40 * 7 + "px");
          setTomEffect((v) => !v);
          break;
        case "l":
          setCurrentHit(2 + 40 * 8 + "px");
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

  const keyboardToggleStep = currentStep - 1 < 0 ? 15 : currentStep - 1;

  useEffect(() => {
    if (currentHit !== "500px") {
      const timeOut = setTimeout(() => {
        setCurrentHit("500px");
      }, 100);
    }
  }, [currentHit]);

  useKeyboardBindings({
    Spacebar: () => setPlaying((v) => !v),
    1: () => setThemeColor("main"),
    2: () => setThemeColor("energe"),
    3: () => setThemeColor("macaroon"),
    4: () => setThemeColor("neon"),
    5: () => setThemeColor("vintage"),
    6: () => setThemeColor("purple"),

    a: () => {
      setCurrentHit(2 + "px");
      if (!recording) {
        player.player("a").start();
        setBoomEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("a"), keyboardToggleStep);
    },
    s: () => {
      setCurrentHit(2 + 40 * 1 + "px");
      if (!recording) {
        player.player("s").start();
        setClapEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("s"), keyboardToggleStep);
    },
    d: () => {
      setCurrentHit(2 + 40 * 2 + "px");
      if (!recording) {
        player.player("d").start();
        setHihatEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("d"), keyboardToggleStep);
    },
    f: () => {
      setCurrentHit(2 + 40 * 3 + "px");
      if (!recording) {
        player.player("f").start();
        setKickEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("f"), keyboardToggleStep);
    },
    g: () => {
      setCurrentHit(2 + 40 * 4 + "px");
      if (!recording) {
        player.player("g").start();
        setOpenhatEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("g"), keyboardToggleStep);
    },
    h: () => {
      setCurrentHit(2 + 40 * 5 + "px");
      if (!recording) {
        player.player("h").start();
        setRideEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("h"), keyboardToggleStep);
    },
    j: () => {
      setCurrentHit(2 + 40 * 6 + "px");
      if (!recording) {
        player.player("j").start();
        setSnareEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("j"), keyboardToggleStep);
    },
    k: () => {
      setCurrentHit(2 + 40 * 7 + "px");
      if (!recording) {
        player.player("k").start();
        setTomEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("k"), keyboardToggleStep);
    },
    l: () => {
      setCurrentHit(2 + 40 * 8 + "px");
      if (!recording) {
        player.player("l").start();
        setTinkEffect((v) => !v);
        return;
      }
      toggleStep(lineMap.indexOf("l"), keyboardToggleStep);
    },
  });

  useEffect(() => {
    const timeOutspeed = (15 / BPMValue) * 1000;
    const timer = setTimeout(() => {
      if (recording || playing) {
        setCurrentStep((currentStep + 1) % steps);
        nextStep(currentStep);
      }
    }, timeOutspeed);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, recording, playing]);

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

  useEffect(() => {
    if (!recording && !image) {
      setScreenshotSpring(true);
    }
  }, [recording]);

  // const toast = useToast();
  // useEffect(() => {
  //   if (!isControllerOpen) {
  //     setScreenshotSpring(false);
  //   }

  //   const timeOut = setTimeout(() => {
  //     console.log("start to guide to another step");
  //     toast({
  //       position: "bottom",
  //       isClosable: true,
  //       duration: 3000,
  //       render: () => (
  //         <Button
  //           p={3}
  //           mb="128px"
  //           colorScheme="purple"
  //           isLoading
  //           spinner={<BsFillCameraFill />}
  //           loadingText="Take a screenshot before update!"
  //         >
  //           Take a screenshot before update!
  //         </Button>
  //       ),
  //     });
  //   }, 8000);

  //   return () => timeOut();
  // }, []);

  function handleBacktoHead() {
    setCurrentStep(0);
    if (!recording) nextStep(0);
  }

  function handlePlaying() {
    setPlaying(!playing);
  }

  function handleStopRecording() {
    if (!recording) return;
    setRecording(false);
    setCurrentStep(0);
    nextStep(0);
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
        position="absolute"
        w="100vw"
        style={{ height: `calc(100vh - 64px)` }}
        top="64px"
        left="0"
        justify="center"
        align="center"
      >
        <Flex
          position="absolute"
          top="0"
          right="0"
          style={{ zIndex: 9 }}
          m={4}
          direction="column"
          alignItems="center"
        >
          <HStack spacing={2}>
            <ScaleSpring move={screenshotSpring && !image}>
              <Tooltip
                hasArrow
                label="Take a sreenshot of your work"
                placement="bottom-end"
                bg={useColorModeValue("gray.500", "gray.300")}
              >
                <Button
                  id="tour-screenshot"
                  onClick={getImage}
                  colorScheme="gray"
                  bg={useColorModeValue("gray.100", "gray.600")}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  leftIcon={<BsFillCameraFill />}
                  size="sm"
                  opacity={0.8}
                >
                  screenshot
                </Button>
              </Tooltip>
            </ScaleSpring>
            <ScaleSpring move={Boolean(image)}>
              <Tooltip
                hasArrow
                label="Upload your work"
                placement="bottom-end"
                bg={useColorModeValue("gray.500", "gray.300")}
              >
                <Button
                  id="tour-upload"
                  onClick={onOpen}
                  colorScheme="gray"
                  bg={useColorModeValue("gray.100", "gray.600")}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  leftIcon={<BsBoxArrowUp />}
                  size="sm"
                  opacity={0.8}
                >
                  upload
                </Button>
              </Tooltip>
            </ScaleSpring>
          </HStack>
          {image && (
            <Image
              w="200px"
              src={image}
              alt={"Screenshot"}
              mt={4}
              boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 9px"
            />
          )}
        </Flex>

        <ThemeProvider theme={colorTheme[themeColor]}>
          <Wrapper ref={ref} onClick={onControllerClose}>
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
        <ChainSpring
          open={
            !isOpen &&
            !isControllerOpen &&
            !recording &&
            !playing &&
            !Boolean(image) &&
            !screenshotSpring
          }
        >
          <Box id="tour-edit-panel" w="100vw" h="100px">
            <HStack
              spacing={2}
              mt={4}
              justifyContent="center"
              position="absolute"
              bottom="35px"
              left="50%"
              transform="translateX(-50%)"
              style={{ zIndex: 200 }}
              id="tour-player"
            >
              <Tooltip
                hasArrow
                label={playing ? "pause" : "play"}
                bg={useColorModeValue("gray.500", "gray.300")}
              >
                <IconButton
                  rounded="full"
                  aria-label="play or pause"
                  bg={useColorModeValue("gray.100", "gray.600")}
                  icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                  onClick={recording ? () => false : handlePlaying}
                  cursor={recording ? "not-allowed" : "pointer"}
                />
              </Tooltip>
              <Tooltip
                hasArrow
                label={"record"}
                bg={useColorModeValue("gray.500", "gray.300")}
              >
                <IconButton
                  transform={"scale(1.1)"}
                  borderWidth="2px"
                  position="relative"
                  bottom={1}
                  rounded="full"
                  variant="outline"
                  colorScheme="red"
                  aria-label="record or stop recording"
                  bg={useColorModeValue("gray.100", "gray.600")}
                  opacity=".9"
                  _focus={{
                    borderColor: "red.500",
                    boxShadow: "0 0 0 1px red.500",
                  }}
                  icon={
                    recording ? (
                      <Notification
                        right="12px"
                        top="12px"
                        activeColor="red.500"
                      />
                    ) : (
                      <BsFillRecordFill />
                    )
                  }
                  onClick={
                    playing || recording
                      ? () => false
                      : () => setRecording(true)
                  }
                  cursor={playing || recording ? "not-allowed" : "pointer"}
                />
              </Tooltip>
              <Tooltip
                hasArrow
                label="stop recording"
                bg={useColorModeValue("gray.500", "gray.300")}
              >
                <IconButton
                  rounded="full"
                  aria-label="stop recording"
                  icon={<BsFillStopFill />}
                  bg={useColorModeValue("gray.100", "gray.600")}
                  onClick={handleStopRecording}
                  cursor={recording ? "pointer" : "not-allowed"}
                />
              </Tooltip>
            </HStack>
            <Button
              h="70px"
              w="100vw"
              pt={4}
              position="fixed"
              bottom="-10px"
              left="0"
              variant="ghost"
              onClick={onControllerOpen}
              // onMouseEnter={onControllerOpen}
              style={{ zIndex: 199 }}
              bg={useColorModeValue("gray.100", "gray.600")}
              _hover={{
                bg: useColorModeValue("gray.200", "gray.700"),
              }}
              opacity="0.8"
              borderTopRadius="100%"
              borderBottomRadius="0"
            >
              Show Edit Panel
            </Button>
          </Box>
        </ChainSpring>

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
            // onMouseLeave={onControllerClose}
            bg={useColorModeValue("white", "gray.600")}
            d="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <CloseButton onClick={onControllerClose} alignSelf="flex-end" />
            <Heading size="md">Edit Panel</Heading>

            <Flex
              direction={["column", "column", "row", "row"]}
              justifyContent={[
                "space-between",
                "space-between",
                "space-around",
              ]}
              flexWrap="wrap"
              w="70%"
              mt={4}
              mb={8}
              mx="auto"
            >
              <Box mx="auto" flexBasis="30%" pl={[0, 0, 0, "5%"]}>
                <Text>Color Theme</Text>
                <HStack spacing={2} mt={2}>
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
              <Box
                mx="auto"
                order={["9", "9", "9", "0"]}
                flexBasis={["60%", "60%", "60%", "30%"]}
                mt={[0, 0, 6, 0]}
              >
                <HStack spacing={2} mt={4} justifyContent="center">
                  <Tooltip
                    hasArrow
                    label="skip to start"
                    bg={useColorModeValue("gray.500", "gray.300")}
                  >
                    <IconButton
                      rounded="full"
                      aria-label="skip to start"
                      icon={<BsSkipStartFill />}
                      onClick={recording ? () => false : handleBacktoHead}
                      cursor={recording ? "not-allowed" : "pointer"}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={playing ? "pause" : "play"}
                    bg={useColorModeValue("gray.500", "gray.300")}
                  >
                    <IconButton
                      rounded="full"
                      aria-label="play or pause"
                      icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                      onClick={recording ? () => false : handlePlaying}
                      cursor={recording ? "not-allowed" : "pointer"}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label={recording ? "stop recording" : "record"}
                    bg={useColorModeValue("gray.500", "gray.300")}
                  >
                    <IconButton
                      transform={"scale(1.1)"}
                      borderWidth="2px"
                      rounded="full"
                      variant="outline"
                      colorScheme="red"
                      position="relative"
                      aria-label="record or stop recording"
                      icon={
                        recording ? (
                          <Notification
                            right="12px"
                            top="12px"
                            activeColor="red.500"
                          />
                        ) : (
                          <BsFillRecordFill />
                        )
                      }
                      onClick={
                        playing ? () => false : () => setRecording(!recording)
                      }
                      cursor={playing ? "not-allowed" : "pointer"}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="stop recording"
                    bg={useColorModeValue("gray.500", "gray.300")}
                  >
                    <IconButton
                      rounded="full"
                      aria-label="stop recording"
                      icon={<BsFillStopFill />}
                      onClick={handleStopRecording}
                      cursor={recording ? "pointer" : "not-allowed"}
                    />
                  </Tooltip>
                  <Tooltip
                    hasArrow
                    label="clean up"
                    bg={useColorModeValue("gray.500", "gray.300")}
                  >
                    <IconButton
                      rounded="full"
                      aria-label="clean up"
                      icon={<BsArrowCounterclockwise />}
                      onClick={recording ? () => false : handleCleanUp}
                      cursor={recording ? "not-allowed" : "pointer"}
                    />
                  </Tooltip>
                </HStack>
              </Box>
              <Box
                my={[8, 8, 0]}
                mx="auto"
                flexBasis="30%"
                pl={[0, 0, "10%", "5%", "10%"]}
              >
                <Text>Bpm</Text>
                <BPMController BPMValue={BPMValue} setBPMValue={setBPMValue} />
              </Box>
            </Flex>

            <Flex
              direction="column"
              alignItems="flex-end"
              w={["100%", "90%", "65%"]}
              mx="auto"
              minW="300px"
              overflowX="scroll"
            >
              <HStack
                style={{ width: `calc(100% - 44px)` }}
                justifyContent="space-around"
                alignItems="baseline"
                position="relative"
              >
                <Button
                  size="xs"
                  position="absolute"
                  bottom="1px"
                  left="-40px"
                  leftIcon={<BsMusicNote />}
                  px={1}
                  iconSpacing="0.1"
                  variant="ghost"
                >
                  4/4
                </Button>
                <Text fontWeight="600" fontSize="lg">
                  1
                </Text>
                <Text fontSize="sm">2</Text>
                <Text fontSize="sm">3</Text>
                <Text fontSize="sm">4</Text>
                <Text fontWeight="600" fontSize="lg">
                  2
                </Text>
                <Text fontSize="sm">2</Text>
                <Text fontSize="sm">3</Text>
                <Text fontSize="sm">4</Text>
                <Text fontWeight="600" fontSize="lg">
                  3
                </Text>
                <Text fontSize="sm">2</Text>
                <Text fontSize="sm">3</Text>
                <Text fontSize="sm">4</Text>
                <Text fontWeight="600" fontSize="lg">
                  4
                </Text>
                <Text fontSize="sm">2</Text>
                <Text fontSize="sm">3</Text>
                <Text fontSize="sm">4</Text>
              </HStack>
              <HStack w="100%" position="relative">
                <Box
                  display={currentHit === "500px" ? "none" : "initial"}
                  top={currentHit}
                  opacity=".4"
                  position="absolute"
                  w="100%"
                  h="36px"
                  bg={useColorModeValue("white", "gray.600")}
                ></Box>
                <IconStack currentPage={currentPage} />
                <Grid
                  sequence={sequence}
                  toggleStep={toggleStep}
                  currentPage={currentPage}
                />
              </HStack>
            </Flex>
            <Flex p={4}>
              <Minimal
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={pagesCount}
                pages={pages}
              />
            </Flex>
          </Box>
        </Slide>
      </Flex>
    </>
  );
};

export default Sequencer;
