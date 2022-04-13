import { React, useState, useEffect } from "react";
import * as Tone from "tone";
import MySequencer from "../components/squencer/MySequencer";
// import VisualEngine from "../components/VisualEngine";
import boom from "../asset/sounds/boom.wav";
import clap from "../asset/sounds/clap.wav";
import hihat from "../asset/sounds/hihat.wav";
import kick from "../asset/sounds/kick.wav";
import openhat from "../asset/sounds/openhat.wav";
import ride from "../asset/sounds/ride.wav";
import snare from "../asset/sounds/snare.wav";
import tink from "../asset/sounds/tink.wav";
import tom from "../asset/sounds/tom.wav";
console.clear();

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

export default function Main() {
  const [playing, setPlaying] = useState(true);

  return (
    <>
      <button onClick={() => setPlaying(!playing)}>click</button>
      <PlayerProvider>
        {({ soundPlayer }) => {
          return <MySequencer player={soundPlayer} playing={playing} />;
        }}
      </PlayerProvider>
    </>
  );
}
