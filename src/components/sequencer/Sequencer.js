import React, { useState, useEffect, createRef, useContext } from "react";
import {
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  CloseButton,
  Box,
  HStack,
  Text,
  Heading,
  Image,
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
import { ThemeProvider } from "@emotion/react";

import usePlayer from "../../customHook/usePlayer";
import useKeyboardBindings from "../../customHook/useKeybroadBindings";
import { useScreenshot } from "../../customHook/useScreenshot";

import UploadModal from "../UploadModal";
import AlertModal from "../AlertModal";

import { colorTheme } from "../motion/colorTheme";
import { MotionWrapper } from "../motion/MotionWrapper";
import { MotionElements } from "../motion/MotionElements";

import { Notification } from "../Notification";
import { IconButtonTooltip } from "./helper/IconButtonTooltips";
import { MusicButton } from "./helper/MusicButton";
import ChainSpring from "./helper/ChainSpring";
import ScaleSpring from "./helper/ScaleSpring";

import BpmController from "./BpmController";
import { Pagination } from "./Pagination";
import { IconStack } from "./IconStack";
import Grid from "./Grid";

import { sequenceConfig } from "../../config";
import { AuthContext } from "../auth/Auth";

const Sequencer = ({ playing, setPlaying, recording, setRecording }) => {
  const [user, isloading, error] = useContext(AuthContext);
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: 3,
    initialState: { currentPage: 1 },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const {
    isOpen: isControllerOpen,
    onOpen: onControllerOpen,
    onClose: onControllerClose,
  } = useDisclosure();

  const ref = createRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current);

  const player = usePlayer();

  const [screenshotSpring, setScreenshotSpring] = useState(false);
  const [themeColor, setThemeColor] = useState("purple");

  const [visualEffect, setVisualEffect] = useState(
    sequenceConfig.getVisualEffectState()
  );
  const [BpmValue, setBpmValue] = useState(120);

  const [newSequence, setNewSequence] = useState(
    sequenceConfig.getSequenceState()
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [toggleLine, setToggleLine] = useState(null);

  const ButtonBackground = useColorModeValue("gray.100", "gray.600");
  const ButtonBackgroundHover = useColorModeValue("gray.200", "gray.700");

  const toggleStep = (line, step) => {
    if (currentPage === 2) line = line + 9;
    if (currentPage === 3) line = line + 18;

    const newSequenceCopy = [...newSequence];
    const status = newSequenceCopy[line][step];
    newSequenceCopy[line][step] = !status;

    setNewSequence(newSequenceCopy);
    setToggleLine(line);

    if (!recording && !status) {
      const alphabeta = sequenceConfig.lineMap[line];
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
          const alphabeta = sequenceConfig.lineMap[i];
          player.player(alphabeta).start();
          setVisualEffect((pre) => ({ ...pre, [alphabeta]: !pre[alphabeta] }));
        }
      }
    }
  };

  useEffect(() => {
    const timeOutspeed =
      (60 / sequenceConfig.meterPerMeasure / BpmValue) * 1000;
    const timer = setTimeout(() => {
      if (recording || playing) {
        setCurrentStep((currentStep + 1) % sequenceConfig.steps);
        playSequence(currentStep);
      }
    }, timeOutspeed);
    return () => {
      clearTimeout(timer);
    };
  }, [currentStep, recording, playing]);

  function ObjectFunctionMap(arr) {
    const obj = {};
    arr.forEach((key, index) => {
      obj[key] = () => {
        if (isOpen) return;
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
    1: () => setThemeColor("purple"),
    2: () => setThemeColor("energe"),
    3: () => setThemeColor("macaroon"),
    4: () => setThemeColor("neon"),
    5: () => setThemeColor("vintage"),
  };

  const keybroadKeyObject = ObjectFunctionMap(sequenceConfig.lineMap);

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
    setNewSequence(sequenceConfig.getSequenceState());
  }

  return (
    <>
      <UploadModal
        isOpen={isOpen}
        onClose={onClose}
        sequence={newSequence}
        bpm={BpmValue}
        image={image}
        themeColor={themeColor}
      />
      <AlertModal isOpen={isAlertOpen} onClose={onAlertClose} />
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
                  bg={ButtonBackground}
                  _hover={{
                    bg: ButtonBackgroundHover,
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
                  onClick={user ? onOpen : onAlertOpen}
                  colorScheme="gray"
                  bg={ButtonBackground}
                  _hover={{
                    bg: ButtonBackgroundHover,
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
            <MotionElements
              visualEffect={visualEffect}
              setVisualEffect={setVisualEffect}
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
              <MusicButton
                label={playing ? "pause" : "play"}
                icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                onClick={recording ? () => false : handlePlaying}
                cursor={recording ? "not-allowed" : "pointer"}
                bg={ButtonBackground}
              />
              <MusicButton
                label={recording ? "stop recording" : "record"}
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
                  playing || recording ? () => false : () => setRecording(true)
                }
                cursor={playing || recording ? "not-allowed" : "pointer"}
                transform={"scale(1.1)"}
                borderWidth="2px"
                position="relative"
                bottom={1}
                variant="outline"
                colorScheme="red"
                bg={ButtonBackground}
                opacity=".9"
              />
              <MusicButton
                label="stop recording"
                icon={<BsFillStopFill />}
                onClick={handleStopRecording}
                cursor={recording ? "pointer" : "not-allowed"}
                bg={ButtonBackground}
              />
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
              bg={ButtonBackground}
              _hover={{
                bg: ButtonBackgroundHover,
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
                    <MusicButton
                      label="skip to start"
                      icon={<BsSkipStartFill />}
                      onClick={recording ? () => false : handleBacktoHead}
                      cursor={recording ? "not-allowed" : "pointer"}
                    />
                    <MusicButton
                      label={playing ? "pause" : "play"}
                      icon={playing ? <BsPauseFill /> : <BsPlayFill />}
                      onClick={recording ? () => false : handlePlaying}
                      cursor={recording ? "not-allowed" : "pointer"}
                    />

                    <MusicButton
                      label={recording ? "stop recording" : "record"}
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
                      transform={"scale(1.1)"}
                      borderWidth="2px"
                      variant="outline"
                      colorScheme="red"
                      position="relative"
                    />
                    <MusicButton
                      label="stop recording"
                      icon={<BsFillStopFill />}
                      onClick={handleStopRecording}
                      cursor={recording ? "pointer" : "not-allowed"}
                    />
                    <MusicButton
                      label="clean up"
                      icon={<BsArrowCounterclockwise />}
                      onClick={recording ? () => false : handleCleanUp}
                      cursor={recording ? "not-allowed" : "pointer"}
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
                  <BpmController
                    BpmValue={BpmValue}
                    setBpmValue={setBpmValue}
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
                    left="-45px"
                    leftIcon={<BsMusicNote />}
                    iconSpacing="0.1"
                    variant="ghost"
                  >
                    4/4
                  </Button>
                  {Array(sequenceConfig.steps)
                    .fill(null)
                    .map((_, index) =>
                      index % 4 === 0 ? (
                        <Text fontWeight="600" fontSize="lg" key={index}>
                          {index / 4 + 1}
                        </Text>
                      ) : (
                        <Text fontSize="sm" key={index}>
                          {index % 4}
                        </Text>
                      )
                    )}
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
