import React, { useState, useEffect, createRef } from "react";
import {
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  CloseButton,
  Box,
  IconButton,
  HStack,
  Text,
  Heading,
  Image,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";

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
import { usePagination } from "@ajna/pagination";
import { ThemeProvider } from "styled-components";

import usePlayer from "../usePlayer";
import { useScreenshot } from "../customHook/useScreenshot";

import UploadModal from "../UploadModal";

import { colorTheme } from "../visual/colorTheme";
import { MotionWrapper } from "../visual/MotionWrapper";
import { BoomTransition } from "../visual/BoomTransition";
import { ClapTransition } from "../visual/ClapTransition";
import { HihatTransition } from "../visual/HihatTransition";
import { KickTransition } from "../visual/KickTransition";
import { OpenhatTransition } from "../visual/OpenhatTransition";
import { RideTransition } from "../visual/RideTransition";
import { SnareTransition } from "../visual/SnareTransition";
import { TomTransition } from "../visual/TomTransition";
import { TinkTransition } from "../visual/TinkTransition";

import { Notification } from "../message/Notification";
import { IconButtonTooltip } from "./IconButtonTooltips";

import BPMController from "./BPMController";
import Pagination from "./Pagination";
import { IconStack } from "./IconStack";
import ChainSpring from "./ChainSpring";
import ScaleSpring from "./ScaleSpring";
import Grid from "./grid";
//sequence
const steps = 16;
const meterPerMeasure = 4; //一小節分成幾拍
const instruments = Array(27).fill(null);
const lineMap = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

const newSequenceState = instruments.map((_) => Array(steps).fill(false));

const initialVisualEffectState = initialVisualEffect(lineMap, false);

function initialVisualEffect(arr, fill) {
  const obj = {};
  arr.forEach((key) => (obj[key] = fill));
  return obj;
}

const Sequencer = ({ playing, setPlaying, recording, setRecording }) => {
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

  const player = usePlayer();

  const [screenshotSpring, setScreenshotSpring] = useState(false);
  const [themeColor, setThemeColor] = useState("purple");

  const [visualEffect, setVisualEffect] = useState(initialVisualEffectState);
  const [BPMValue, setBPMValue] = useState(120);

  const [newSequence, setNewSequence] = useState(newSequenceState);

  const [currentStep, setCurrentStep] = useState(0);
  const [toggleLine, setToggleLine] = useState(null);

  const toggleStep = (line, step) => {
    if (currentPage === 2) line = line + 9;
    if (currentPage === 3) line = line + 18;

    const newSequenceCopy = [...newSequence];
    const status = newSequenceCopy[line][step];
    newSequenceCopy[line][step] = !status;

    setNewSequence(newSequenceCopy);
    setToggleLine(line);

    if (!recording && !status) {
      const alphabeta = lineMap[line];
      setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
      player.player(alphabeta).start();
    }
  };

  useEffect(() => {
    if (toggleLine !== null) {
      setTimeout(() => {
        setToggleLine(null);
      }, 150);
    }
  }, [toggleLine]);

  const playSequence = (currentStep) => {
    for (let i = 0; i < newSequence.length; i++) {
      for (let j = 0; j < newSequence[i].length; j++) {
        if (newSequence[i][j] && j === currentStep) {
          const alphabeta = lineMap[i];
          player.player(alphabeta).start();
          setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
        }
      }
    }
  };

  useEffect(() => {
    const timeOutspeed = (60 / meterPerMeasure / BPMValue) * 1000;
    const timer = setTimeout(() => {
      if (recording || playing) {
        setCurrentStep((currentStep + 1) % steps);
        playSequence(currentStep);
      }
    }, timeOutspeed);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, recording, playing]);

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

  function ObjectFunctionMap(arr) {
    const obj = {};
    arr.forEach((key, index) => {
      obj[key] = () => {
        setToggleLine(index);
        if (!recording) {
          player.player(key).start();
          setVisualEffect((pre) => ({ ...pre, [key]: true }));
          return;
        }
        toggleStep(index, currentStep);
      };
    });
    return obj;
  }

  const keyboardColorObject = {
    Spacebar: () => setPlaying(!playing),
    1: () => setThemeColor("main"),
    2: () => setThemeColor("energe"),
    3: () => setThemeColor("macaroon"),
    4: () => setThemeColor("neon"),
    5: () => setThemeColor("vintage"),
    6: () => setThemeColor("purple"),
  };

  const keybroadKeyObject = ObjectFunctionMap(lineMap);

  useKeyboardBindings({ ...keyboardColorObject, ...keybroadKeyObject });

  useEffect(() => {
    if (!recording && !image) {
      setScreenshotSpring(true);
    }
  }, [recording]);

  function handleBacktoHead() {
    setCurrentStep(0);
    if (!recording) playSequence(0);
  }

  function handlePlaying() {
    setPlaying(!playing);
  }

  function handleStopRecording() {
    if (!recording) return;
    setRecording(false);
    setCurrentStep(0);
    playSequence(0);
  }

  function handleCleanUp() {
    console.log("work");
    setNewSequence(instruments.map((_) => Array(steps).fill(false)));
  }

  console.log(newSequence);

  return (
    <>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        sequence={newSequence}
        bpm={BPMValue}
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
              <IconButtonTooltip
                label="Take a sreenshot of your work"
                placement="bottom-end"
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
              </IconButtonTooltip>
            </ScaleSpring>
            <ScaleSpring move={Boolean(image)}>
              <IconButtonTooltip
                label="Upload your work"
                placement="bottom-end"
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
              </IconButtonTooltip>
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
          <MotionWrapper ref={ref} onClick={onControllerClose}>
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
              <IconButtonTooltip label={playing ? "pause" : "play"}>
                <IconButton
                  rounded="full"
                  aria-label="play or pause"
                  bg={useColorModeValue("gray.100", "gray.600")}
                  icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                  onClick={recording ? () => false : handlePlaying}
                  cursor={recording ? "not-allowed" : "pointer"}
                />
              </IconButtonTooltip>
              <IconButtonTooltip label={"record"}>
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
              </IconButtonTooltip>
              <IconButtonTooltip label="stop recording">
                <IconButton
                  rounded="full"
                  aria-label="stop recording"
                  icon={<BsFillStopFill />}
                  bg={useColorModeValue("gray.100", "gray.600")}
                  onClick={handleStopRecording}
                  cursor={recording ? "pointer" : "not-allowed"}
                />
              </IconButtonTooltip>
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
        <Drawer
          placement="bottom"
          onClose={onControllerClose}
          isOpen={isControllerOpen}
        >
          <DrawerOverlay />
          <DrawerContent>
            <Box
              py={5}
              px={10}
              rounded="md"
              shadow="base"
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
                <Box mx="auto" flexBasis="30%" pl={[0, 0, 0, "2%"]}>
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
                    <IconButtonTooltip label="skip to start">
                      <IconButton
                        rounded="full"
                        aria-label="skip to start"
                        icon={<BsSkipStartFill />}
                        onClick={recording ? () => false : handleBacktoHead}
                        cursor={recording ? "not-allowed" : "pointer"}
                      />
                    </IconButtonTooltip>
                    <IconButtonTooltip label={playing ? "pause" : "play"}>
                      <IconButton
                        rounded="full"
                        aria-label="play or pause"
                        icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                        onClick={recording ? () => false : handlePlaying}
                        cursor={recording ? "not-allowed" : "pointer"}
                      />
                    </IconButtonTooltip>
                    <IconButtonTooltip
                      label={recording ? "stop recording" : "record"}
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
                    </IconButtonTooltip>
                    <IconButtonTooltip label="stop recording">
                      <IconButton
                        rounded="full"
                        aria-label="stop recording"
                        icon={<BsFillStopFill />}
                        onClick={handleStopRecording}
                        cursor={recording ? "pointer" : "not-allowed"}
                      />
                    </IconButtonTooltip>
                    <Tooltip label="clean up">
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
                  <BPMController
                    BPMValue={BPMValue}
                    setBPMValue={setBPMValue}
                  />
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
                  <IconStack currentPage={currentPage} />
                  <Grid
                    sequence={newSequence}
                    toggleStep={toggleStep}
                    currentPage={currentPage}
                    currentStep={currentStep}
                    toggleLine={toggleLine}
                  />
                </HStack>
              </Flex>
              <Flex p={4}>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pagesCount={pagesCount}
                  pages={pages}
                />
              </Flex>
            </Box>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  );
};

export default Sequencer;
