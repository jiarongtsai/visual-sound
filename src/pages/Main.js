import { React, useState, useEffect } from "react";
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
import * as Tone from "tone";
import MySequencer from "../components/squencer/MySequencer";
console.clear();

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
  height: 25vh;
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

const PlayerProvider = ({ children }) => {
  const [soundPlayer, setSoundPlayer] = useState(null);
  useEffect(() => {
    const soundPlayer = new Tone.Players(
      {
        a: boom,
        s: clap,
        d: hihat,
        f: kick,
        g: openhat,
        h: ride,
        j: snare,
        k: tom,
        l: tink,
      },
      () => {
        console.log("sound loaded");
        setSoundPlayer(soundPlayer);
      }
    ).toDestination();
  }, []);
  return children({ soundPlayer });
};

const VisualEngine = ({ player }) => {
  const [boomEffect, setBoomEffect] = useState(false);
  const [clapEffect, setClapEffect] = useState(false);
  const [hihatEffect, setHihatEffect] = useState(false);
  const [kickEffect, setKickEffect] = useState(false);
  const [openhatEffect, setOpenhatEffect] = useState(false);
  const [rideEffect, setRideEffect] = useState(false);
  const [snareEffect, setSnareEffect] = useState(false);
  const [tomEffect, setTomEffect] = useState(false);
  const [tinkEffect, setTinkEffect] = useState(false);

  useKeyboardBindings({
    a: () => {
      player.player("a").start();
      setBoomEffect((v) => !v);
    },
    s: () => {
      player.player("s").start();
      setClapEffect((v) => !v);
    },
    d: () => {
      player.player("d").start();
      setHihatEffect((v) => !v);
    },
    f: () => {
      player.player("f").start();
      setKickEffect((v) => !v);
    },
    g: () => {
      player.player("g").start();
      setOpenhatEffect((v) => !v);
    },
    h: () => {
      player.player("h").start();
      setRideEffect((v) => !v);
    },
    j: () => {
      player.player("j").start();
      setSnareEffect((v) => !v);
    },
    k: () => {
      player.player("k").start();
      setTomEffect((v) => !v);
    },
    l: () => {
      player.player("l").start();
      setTinkEffect((v) => !v);
    },
  });

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
  return (
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
  );
};

export default function Main() {
  return (
    <>
      <PlayerProvider>
        {({ soundPlayer }) => {
          return (
            <>
              <VisualEngine player={soundPlayer} />
              <MySequencer player={soundPlayer} />
            </>
          );
        }}
      </PlayerProvider>
    </>
  );
}
