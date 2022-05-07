import React, { useState, useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as Tone from "tone";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import useDrumkit from "../soundHook/useDrumkit";
import useKeybroadBindings from "../components/customHook/useKeybroadBindings";
import "../pages/Create.css";

export default function KeybroadControl() {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const [octave, setOctave] = useState([4, 5]);
  const [track, setTrack] = useState(true);
  const keyboard = useRef();

  const drumKitPlayer = useDrumkit();

  //melody
  const synth = new Tone.Synth().toDestination();

  function playNote(note) {
    synth.triggerAttackRelease(`${note}`, "8n");
  }

  function toggleClass(key) {
    const target = document.querySelector(`[data-skbtn='${key}']`);
    target.classList.add("hg-button-active");
    // ??? should it be clean?
    const timer = setTimeout(
      () => target.classList.remove("hg-button-active"),
      100
    );
  }

  Tone.Transport.scheduleRepeat(function (time) {
    //do something with the time
    synth.triggerAttackRelease("C4", "8n");
  }, "8n");

  useKeybroadBindings({
    1: () => {
      toggleClass("1");
    },
    2: () => {
      toggleClass("2");
    },
    3: () => {
      toggleClass("3");
    },
    4: () => {
      toggleClass("4");
    },
    5: () => {
      toggleClass("5");
      track ? playNote(`C#${octave[1]}`) : drumKitPlayer.player("5").start();
    },
    6: () => {
      toggleClass("6");
      track ? playNote(`D#${octave[1]}`) : drumKitPlayer.player("6").start();
    },
    7: () => {
      toggleClass("7");
      !track && drumKitPlayer.player("7").start();
    },
    8: () => {
      toggleClass("8");
      track ? playNote(`F#${octave[1]}`) : drumKitPlayer.player("8").start();
    },
    9: () => {
      toggleClass("9");
      track ? playNote(`G#${octave[1]}`) : drumKitPlayer.player("9").start();
    },
    0: () => {
      toggleClass("0");
      track ? playNote(`A#${octave[1]}`) : drumKitPlayer.player("0").start();
    },
    q: () => {
      toggleClass("q");
      !track && drumKitPlayer.player("q").start();
    },
    w: () => {
      toggleClass("w");
      !track && drumKitPlayer.player("w").start();
    },
    e: () => {
      toggleClass("e");
      !track && drumKitPlayer.player("e").start();
    },
    r: () => {
      toggleClass(",");
      if (track) {
        playNote(`C${octave[1]}`);
        toggleClass("r");
        return;
      }
      drumKitPlayer.player("r").start();
    },
    t: () => {
      toggleClass("t");
      track ? playNote(`D${octave[1]}`) : drumKitPlayer.player("t").start();
    },
    y: () => {
      toggleClass("y");
      track ? playNote(`E${octave[1]}`) : drumKitPlayer.player("y").start();
    },
    u: () => {
      toggleClass("u");
      track ? playNote(`F${octave[1]}`) : drumKitPlayer.player("u").start();
    },
    i: () => {
      toggleClass("i");
      track ? playNote(`G${octave[1]}`) : drumKitPlayer.player("i").start();
    },
    o: () => {
      toggleClass("o");
      track ? playNote(`A${octave[1]}`) : drumKitPlayer.player("o").start();
    },
    p: () => {
      toggleClass("p");
      track ? playNote(`B${octave[1]}`) : drumKitPlayer.player("p").start();
    },
    "[": () => {
      toggleClass("[");
      if (octave[0] > 1) {
        const newOctave = [...octave].map((i) => i - 1);
        setOctave(newOctave);
      }
    },
    "]": () => {
      toggleClass("]");
      if (octave[0] < 7) {
        const newOctave = [...octave].map((i) => i + 1);
        setOctave(newOctave);
      }
    },
    a: () => {
      toggleClass("a");
      !track && drumKitPlayer.player("a").start();
      //   track ? console.log("") : drumKitPlayer.player("a").start();
    },
    s: () => {
      toggleClass("s");
      track ? playNote(`C#${octave[0]}`) : drumKitPlayer.player("s").start();
    },
    d: () => {
      toggleClass("d");
      track ? playNote(`D#${octave[0]}`) : drumKitPlayer.player("d").start();
    },
    f: () => {
      toggleClass("f");
      !track && drumKitPlayer.player("f").start();
    },
    g: () => {
      toggleClass("g");
      track ? playNote(`F#${octave[0]}`) : drumKitPlayer.player("g").start();
    },
    h: () => {
      toggleClass("h");
      track ? playNote(`G#${octave[0]}`) : drumKitPlayer.player("h").start();
    },
    j: () => {
      toggleClass("j");
      track ? playNote(`A#${octave[0]}`) : drumKitPlayer.player("j").start();
    },
    k: () => {
      toggleClass("k");
      !track && drumKitPlayer.player("k").start();
    },
    l: () => {
      toggleClass("l");
      !track && drumKitPlayer.player("l").start();
      //   track ? playNote("C#5") : drumKitPlayer.player("l").start();
    },
    ";": () => {
      toggleClass(";");
      //   track ? playNote("D#5") : drumKitPlayer.player(";").start();
    },
    // "'": () => console.log(2),
    z: () => {
      toggleClass("z");
      track ? playNote(`C${octave[0]}`) : drumKitPlayer.player("z").start();
    },
    x: () => {
      toggleClass("x");
      track ? playNote(`D${octave[0]}`) : drumKitPlayer.player("x").start();
    },
    c: () => {
      toggleClass("c");
      track ? playNote(`E${octave[0]}`) : drumKitPlayer.player("c").start();
    },
    v: () => {
      toggleClass("v");
      track ? playNote(`F${octave[0]}`) : drumKitPlayer.player("v").start();
    },
    b: () => {
      toggleClass("b");
      track ? playNote(`G${octave[0]}`) : drumKitPlayer.player("b").start();
    },
    n: () => {
      toggleClass("n");
      track ? playNote(`A${octave[0]}`) : drumKitPlayer.player("n").start();
    },
    m: () => {
      toggleClass("m");
      track ? playNote(`B${octave[0]}`) : drumKitPlayer.player("m").start();
    },
    ",": () => {
      toggleClass(",");
      if (track) {
        toggleClass("r");
        playNote(`C${octave[1]}`);
        return;
      }

      drumKitPlayer.player(",").start();
    },

    Escape: () => {
      setTrack((pre) => !pre);
    },
  });

  const onChange = (input) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };
  //   const onKeyPress = (button) => {
  //     switch (button) {
  //       case "a":
  //         track ? console.log("") : drumKitPlayer.player("a").start();
  //         break;
  //       case "s":
  //         track ? playNote(`C#${octave[0]}`) : drumKitPlayer.player("s").start();
  //         break;
  //       case "d":
  //         track ? playNote(`D#${octave[0]}`) : drumKitPlayer.player("d").start();
  //         break;
  //       case "f":
  //         track ? console.log("") : drumKitPlayer.player("f").start();
  //         break;
  //       case "g":
  //         track ? playNote(`F#${octave[0]}`) : drumKitPlayer.player("g").start();
  //         break;
  //       case "h":
  //         track ? playNote(`G#${octave[0]}`) : drumKitPlayer.player("h").start();
  //         break;
  //       case "j":
  //         track ? playNote(`A#${octave[0]}`) : drumKitPlayer.player("j").start();
  //         break;
  //       case "k":
  //         // track ? console.log("") : drumKitPlayer.player("k").start();
  //         break;
  //       case "l":
  //         // track ? playNote("C#5") : drumKitPlayer.player("l").start();
  //         break;
  //       case ";":
  //         // track ? playNote("D#5") : drumKitPlayer.player(";").start();
  //         break;
  //       case "z":
  //         track ? playNote("C4") : drumKitPlayer.player("z").start();
  //         break;
  //       case "x":
  //         track ? playNote("D4") : drumKitPlayer.player("x").start();
  //         break;
  //       case "c":
  //         track ? playNote("E4") : drumKitPlayer.player("c").start();
  //         break;
  //       case "v":
  //         track ? playNote("F4") : drumKitPlayer.player("v").start();
  //         break;
  //       case "b":
  //         track ? playNote("G4") : drumKitPlayer.player("b").start();
  //         break;
  //       case "n":
  //         track ? playNote("A4") : drumKitPlayer.player("n").start();
  //         break;
  //       case "m":
  //         track ? playNote("B4") : drumKitPlayer.player("m").start();
  //         break;
  //       case ",":
  //         track ? playNote("C5") : drumKitPlayer.player(",").start();
  //         break;
  //       case ".":
  //         track ? playNote("D5") : drumKitPlayer.player(".").start();
  //         break;
  //       case "/":
  //         track ? playNote("E5") : drumKitPlayer.player("/").start();
  //         break;
  //       default:
  //         console.log("Button pressed", button);
  //     }

  //     if (button === "{shift}" || button === "{lock}") handleShift();
  //   };

  const onChangeInput = (event) => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };
  return (
    <Box w={["100%", "100%", "70%", "70%", "50%"]} mb={8}>
      <input value={input} onChange={onChangeInput} />
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layout={{
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space} @ .com",
          ],
          shift: [
            "~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M &lt; &gt; ? {shift}",
            ".com @ {space}",
          ],
        }}
        layoutName={layout}
        display={{
          "{shift}": "shift ⇧",
          "{escape}": "esc ⎋",
          "{tab}": " ⇥",
          "{bksp}": "back ⌫",
          "{enter}": "enter ↵",
          "{lock}": "lock",
          "{space}": "play/pause",
        }}
        onChange={onChange}
        //   onKeyPress={onKeyPress}
        theme={`hg-theme-default default${track ? " keybroad" : " drumKit"}`}
        autoUseTouchEvents={true}
      />
    </Box>
  );
}
