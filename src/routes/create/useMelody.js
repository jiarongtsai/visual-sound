import React, { useState, useEffect } from "react";
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
  const [melodayPlayer, setMelodyPlayer] = useState(null);
  const synth = new Tone.Synth().toDestination();

  // function playNote(note) {
  //   synth.triggerAttackRelease(`${note}4`, "8n");
  // }

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
        console.log("meloday loaded");
        setMelodyPlayer(soundPlayer);
      }
    ).toDestination();
    return () => {
      soundPlayer.dispose();
      soundPlayer.disconnect();
    };
  }, []);
  return melodayPlayer;
};
