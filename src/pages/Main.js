import { React, useState, useEffect } from "react";
import useSound from "use-sound";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";
import boom from "../asset/sounds/boom.wav";
import clap from "../asset/sounds/clap.wav";
import hihat from "../asset/sounds/hihat.wav";
import kick from "../asset/sounds/kick.wav";
import openhat from "../asset/sounds/openhat.wav";
import ride from "../asset/sounds/ride.wav";
import snare from "../asset/sounds/snare.wav";
import tink from "../asset/sounds/tink.wav";
import tom from "../asset/sounds/tom.wav";

const useKeyboardBindings = (map) => {
  useEffect(() => {
    const handlePress = (event) => {
      const handler = map[event.key];

      if (typeof handler === "function") {
        handler();
      } else {
        return;
      }
    };

    window.addEventListener("keydown", handlePress);

    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, [map]);
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const Square = styled(animated.div)`
  width: 50px;
  height: 50px;
  background: ${(props) => props.color};
  border-radius: 10%;
`;

const Ellipse = styled(animated.div)`
  width: 50px;
  height: 50px;
  background: ${(props) => props.color};
  border-radius: 50%;
`;

const Triangle = styled(animated.div)`
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid ${(props) => props.color};
`;

const Button = (props) => {
  const [play] = useSound(props.sound);
  return (
    <button
      onClick={() => {
        play();
        props.setEffect((v) => !v);
      }}
    >
      {props.soundName}
    </button>
  );
};

const Input = styled.input.attrs({
  type: "checkbox",
})`
  width: 20px;
  height: 20px;
`;

export default function Main() {
  const [boomEffect, setBoomEffect] = useState(false);
  const [clapEffect, setClapEffect] = useState(false);
  const [hihatEffect, setHihatEffect] = useState(false);
  const [kickEffect, setKickEffect] = useState(false);
  const [openhatEffect, setOpenhatEffect] = useState(false);
  const [rideEffect, setRideEffect] = useState(false);
  const [snareEffect, setSnareEffect] = useState(false);
  const [tomEffect, setTomEffect] = useState(false);
  const [tinkEffect, setTinkEffect] = useState(false);
  const [playPattern, setPlayPattern] = useState({
    a: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    f: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    g: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    h: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    j: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    k: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    l: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const handleRecordingchange = (key, index) => {
    setPlayPattern((pre) => ({
      ...pre,
      [key]: [
        ...pre[key].slice(0, index),
        1 - pre[key][index],
        ...pre[key].slice(index + 1),
      ],
    }));
  };

  const allTrack = [
    { sound: boom, name: "boom", setEffect: setBoomEffect },
    { sound: clap, name: "clap", setEffect: setClapEffect },
    { sound: hihat, name: "hihat", setEffect: setHihatEffect },
    { sound: kick, name: "kick", setEffect: setKickEffect },
    { sound: openhat, name: "openhat", setEffect: setOpenhatEffect },
    { sound: ride, name: "ride", setEffect: setRideEffect },
    { sound: snare, name: "snare", setEffect: setSnareEffect },
    { sound: tom, name: "tom", setEffect: setTomEffect },
    { sound: tink, name: "tink", setEffect: setTinkEffect },
  ];

  const boomTransition = useTransition(boomEffect, {
    config: { mass: 1, tension: 10, friction: 4 },
    from: { opacity: 0, transform: "scale(0)" },
    enter: { opacity: 0.5, transform: "scale(4)" },
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
    from: { x: -100, y: 500, opacity: 0 },
    enter: { x: -100, y: 0, opacity: 0.8 },
    leave: { x: -100, y: 500, opacity: 0 },
  });

  const kickTransition = useTransition(kickEffect, {
    from: { x: -100, y: 10, opacity: 0, transform: "scale(0)" },
    enter: { x: 0, y: 0, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 100, y: 10, opacity: 0, transform: "scale(0)" },
  });

  const openhatTransition = useTransition(openhatEffect, {
    config: { mass: 1, tension: 500, friction: 18 },
    from: { x: -1000, y: -1000, opacity: 0, transform: "scale(2)" },
    enter: { x: 0, y: 0, opacity: 0.8, transform: "scale(4)" },
    leave: { x: 1000, y: 1000, opacity: 0, transform: "scale(2)" },
  });

  const rideTransition = useTransition(rideEffect, {
    from: { x: -100, y: 1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: -100, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 100, y: 1000, opacity: 0, transform: "rotate(9.5turn)" },
  });

  const snareTransition = useTransition(snareEffect, {
    from: { x: -1000, y: 300, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 0.8 },
    leave: { x: 1000, y: 300, opacity: 0 },
  });

  const tomTransition = useTransition(tomEffect, {
    config: { mass: 1, tension: 100, friction: 18 },
    from: { x: -100, y: 1000, opacity: 0, transform: "scale(0)" },
    enter: { x: 0, y: -100, opacity: 0.8, transform: "scale(2)" },
    leave: { x: 100, y: 1000, opacity: 0, transform: "scale(0)" },
  });

  const tinkTransition = useTransition(tinkEffect, {
    from: { x: 0, y: 500, opacity: 0 },
    enter: { x: 0, y: -50, opacity: 0.8 },
    leave: { x: 0, y: 500, opacity: 0 },
  });

  const [playboom] = useSound(boom);
  const [playclap] = useSound(clap);
  const [playhihat] = useSound(hihat);
  const [playkick] = useSound(kick);
  const [playopenhat] = useSound(openhat);
  const [playride] = useSound(ride);
  const [playsnare] = useSound(snare);
  const [playtom] = useSound(tom);
  const [playtink] = useSound(tink);

  useKeyboardBindings({
    a: () => playboom(),
    s: () => playclap(),
    d: () => playhihat(),
    f: () => playkick(),
    g: () => playopenhat(),
    h: () => playride(),
    j: () => playsnare(),
    k: () => playtom(),
    l: () => playtink(),
  });

  const [keydown, setKeydown] = useState("");

  useEffect(() => {
    const handleKeydown = (event) => {
      setKeydown(`key='${event.key}' | code='${event.code}'`);
      switch (event.key) {
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
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <>
      <div>{keydown}</div>
      {allTrack.map((sound) => {
        return (
          <Button
            setEffect={sound.setEffect}
            sound={sound.sound}
            soundName={sound.name}
            key={sound.name}
          />
        );
      })}
      <Wrapper>
        {boomTransition((style, item) =>
          item ? <Ellipse style={style} color="steelblue" /> : ""
        )}
        {clapTransition((style, item) =>
          item ? <Triangle style={style} color="yellow" /> : ""
        )}
        {hihatTransition((style, item) =>
          item ? <Triangle style={style} color="darkorange" /> : ""
        )}
        {kickTransition((style, item) =>
          item ? <Square style={style} color="green" /> : ""
        )}
        {openhatTransition((style, item) =>
          item ? <Triangle style={style} color="gold" /> : ""
        )}
        {rideTransition((style, item) =>
          item ? <Square style={style} color="purple" /> : ""
        )}
        {snareTransition((style, item) =>
          item ? <Square style={style} color="blue" /> : ""
        )}
        {tomTransition((style, item) =>
          item ? <Ellipse style={style} color="slategray" /> : ""
        )}
        {tinkTransition((style, item) =>
          item ? <Triangle style={style} color="red" /> : ""
        )}
      </Wrapper>
      {Object.entries(playPattern).map((pattern) => {
        return (
          <div key={pattern[0]}>
            <span>{pattern[0]}</span>
            {pattern[1].map((graph, i) => (
              <Input
                key={i}
                checked={Boolean(graph)}
                onChange={() => handleRecordingchange(pattern[0], i)}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
