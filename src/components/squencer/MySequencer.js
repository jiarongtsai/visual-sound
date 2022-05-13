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
                bg: "purple.300",
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

const Sequencer = ({ player }) => {
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
    if (currentPage === 2) line = line + 9;
    if (currentPage === 3) line = line + 18;

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
    Spacebar: () => setPlaying((v) => !v),
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
            <Button
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
            <Button
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
          </HStack>
          {image && (
            <Image
              w="200px"
              src={image}
              alt={"Screenshot"}
              mt={2}
              shadow="base"
            />
          )}
        </Flex>

        <ThemeProvider theme={colorTheme[themeColor]}>
          <Wrapper ref={ref}>
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
        <Button
          w="100vw"
          position="fixed"
          bottom="0"
          left="0"
          variant="ghost"
          onClick={onControllerOpen}
          onMouseEnter={onControllerOpen}
          style={{ zIndex: 199 }}
          color={"gray.800"}
          bg={"gray.100"}
          opacity="0.5"
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
                {/* <Text>Player</Text> */}
                <HStack spacing={2} mt={4} justifyContent="center">
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
            {/* <IconButton aria-label="record" icon={<BsFillRecordFill />} />
              <IconButton aria-label="stop" icon={<BsFillStopFill />} /> */}
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
              >
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
              <HStack w="100%">
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
