import { useState, useEffect } from "react";
import * as Tone from "tone";

import boom from "../asset/sounds/boom.wav";
import clap from "../asset/sounds/clap.wav";
import hihat from "../asset/sounds/hihat.wav";
import kick from "../asset/sounds/kick.wav";
import openhat from "../asset/sounds/openhat.wav";
import ride from "../asset/sounds/ride.wav";
import snare from "../asset/sounds/snare.wav";
import tink from "../asset/sounds/tink.wav";
import tom from "../asset/sounds/tom.wav";

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
    return () => {
      soundPlayer.dispose();
      soundPlayer.disconnect();
    };
  }, []);
  return children({ soundPlayer });
};

export { PlayerProvider };
