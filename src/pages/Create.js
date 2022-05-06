import React, { useState, useRef, useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import {
  BsSkipStartFill,
  BsPauseFill,
  BsPlayFill,
  BsArrowCounterclockwise,
} from "react-icons/bs";
import * as Tone from "tone";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import useMelody from "../soundHook/useMelody";
import useDrumkit from "../soundHook/useDrumkit";
import useKeybroadBindings from "../components/customHook/useKeybroadBindings";
import "./Create.css";

export default function Create() {
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();
  const {
    isOpen: isControllerOpen,
    onOpen: onControllerOpen,
    onClose: onControllerClose,
  } = useDisclosure();

  const melodyPlayer = useMelody();
  const drumKitPlayer = useDrumkit();
  const [track, setTrack] = useState(true);

  //melody
  const synth = new Tone.Synth().toDestination();

  function playNote(note) {
    synth.triggerAttackRelease(`${note}`, "8n");
  }

  useKeybroadBindings({
    1: () => setTrack(true),
    2: () => setTrack(true),
    3: () => setTrack(true),
    4: () => setTrack(true),
    5: () => setTrack(false),
    6: () => setTrack(false),
    7: () => setTrack(false),
    8: () => setTrack(false),
    // w: () => console.log(2),
    // e: () => console.log(3),
    // r: () => console.log(1),
    // t: () => console.log(2),
    // y: () => console.log(3),
    // u: () => console.log(1),
    // i: () => console.log(2),
    // o: () => console.log(3),
    // p: () => console.log(3),
    // "[": () => console.log(3),
    // "]": () => console.log(3),
    a: () => (track ? playNote("C#4") : drumKitPlayer.player("a").start()),
    s: () => (track ? playNote("C#4") : drumKitPlayer.player("s").start()),
    d: () => (track ? playNote("D#4") : drumKitPlayer.player("d").start()),
    f: () => (track ? "" : drumKitPlayer.player("f").start()),
    g: () => (track ? playNote("F#4") : drumKitPlayer.player("g").start()),
    h: () => (track ? playNote("G#4") : drumKitPlayer.player("h").start()),
    j: () => (track ? playNote("A#4") : drumKitPlayer.player("j").start()),
    k: () => (track ? "" : drumKitPlayer.player("k").start()),
    l: () => (track ? playNote("C#5") : drumKitPlayer.player("l").start()),
    ";": () => (track ? playNote("D#5") : drumKitPlayer.player("lr").start()),
    // "'": () => console.log(2),
    z: () => (track ? playNote("C4") : drumKitPlayer.player("z").start()),
    x: () => (track ? playNote("D4") : drumKitPlayer.player("x").start()),
    c: () => (track ? playNote("E4") : drumKitPlayer.player("c").start()),
    v: () => (track ? playNote("F4") : drumKitPlayer.player("v").start()),
    b: () => (track ? playNote("G4") : drumKitPlayer.player("b").start()),
    n: () => (track ? playNote("A4") : drumKitPlayer.player("n").start()),
    m: () => (track ? playNote("B4") : drumKitPlayer.player("m").start()),
    ",": () => (track ? playNote("C5") : drumKitPlayer.player("mr").start()),
    ".": () => (track ? playNote("D5") : drumKitPlayer.player("mrr").start()),
    "/": () => (track ? playNote("E5") : ""),
  });

  const onChange = (input) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = (button) => {
    switch (button) {
      case "1":
        console.log("hello");
        break;
      default:
        console.log("Button pressed", button);
    }

    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const onChangeInput = (event) => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

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
          </HStack>
          <Box w={["100%", "100%", "70%"]}>
            <input
              value={input}
              placeholder={"Tap on the virtual keyboard to start"}
              onChange={onChangeInput}
            />
            <Keyboard
              keyboardRef={(r) => (keyboard.current = r)}
              layoutName={layout}
              display={{
                "{shift}": "shift ⇧",
                "{escape}": "esc ⎋",
                "{tab}": " ⇥",
                "{bksp}": "back ⌫",
                "{enter}": "enter ↵",
                "{lock}": "lock",
              }}
              onChange={onChange}
              onKeyPress={onKeyPress}
              theme={`hg-theme-default default${
                track ? " keybroad" : " drumKit"
              }`}
              autoUseTouchEvents={true}
            />
          </Box>
          {/* <IconButton aria-label="record" icon={<BsFillRecordFill />} />
              <IconButton aria-label="stop" icon={<BsFillStopFill />} /> */}
          {/* <Grid sequence={sequence} toggleStep={toggleStep} /> */}
        </Box>
      </Slide>
    </Flex>
  );
}
