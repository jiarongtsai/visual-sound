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

export default () => {
  const [player, setPlayer] = useState(null);
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
        console.log("player loaded");
        setPlayer(soundPlayer);
      }
    ).toDestination();
    return () => {
      soundPlayer.dispose();
      soundPlayer.disconnect();
    };
  }, []);
  return player;
};
