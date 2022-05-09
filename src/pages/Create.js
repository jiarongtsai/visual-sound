import React, { useState } from "react";
import {
  Flex,
  Button,
  Fade,
  Box,
  Slide,
  Heading,
  CloseButton,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  BsSkipStartFill,
  BsPauseFill,
  BsPlayFill,
  BsArrowCounterclockwise,
  BsChevronDoubleLeft,
} from "react-icons/bs";

import KeybroadControl from "../components/KeybroadControl";
import Sequence from "../components/Sequence";
import DrumMachine from "../components/drumMachine/DrumMachine";

export default function Create() {
  const [playing, setPlaying] = useState(false);
  const {
    isOpen: isControllerOpen,
    onOpen: onControllerOpen,
    onClose: onControllerClose,
  } = useDisclosure();

  return (
    <Flex mt={24} w="100vw" mx="auto">
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
          //   onMouseLeave={onControllerClose} //temp
          bg={useColorModeValue("white", "gray.600")}
          d="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <CloseButton onClick={onControllerClose} alignSelf="flex-end" />
          <Heading size="md">Editing Panel</Heading>
          {/* 
          <HStack spacing={2} my={8}>
            <IconButton
              aria-label="skip to start"
              icon={<BsSkipStartFill />}
              //   onClick={handleBacktoHead}
            />
            <IconButton
              aria-label="play or pause"
              icon={playing ? <BsPauseFill /> : <BsPlayFill />}
              onClick={() => setPlaying(!playing)}
            />

            <IconButton
              aria-label="clean up"
              icon={<BsArrowCounterclockwise />}
              //   onClick={handleCleanUp}
            />
          </HStack> */}
          <KeybroadControl playing={playing} setPlaying={setPlaying} />
          {/* <Sequence /> */}
          {/* <DrumMachine /> */}
          {/* <IconButton aria-label="record" icon={<BsFillRecordFill />} />
              <IconButton aria-label="stop" icon={<BsFillStopFill />} /> */}
          {/* <Grid sequence={sequence} toggleStep={toggleStep} /> */}
        </Box>
      </Slide>
    </Flex>
  );
}
