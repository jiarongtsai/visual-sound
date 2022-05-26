import { useState, useEffect } from "react";
import * as Tone from "tone";

import tink from "../asset/sounds/tink.wav";
import brush01 from "../asset/sounds/brush01.wav";
import brush02 from "../asset/sounds/brush02.wav";
import clap01 from "../asset/sounds/clap01.wav";
import clap02 from "../asset/sounds/clap02.wav";
import crash01 from "../asset/sounds/crash01.wav";
import crash02 from "../asset/sounds/crash02.wav";
import kick01 from "../asset/sounds/kick01.wav";
import kick02 from "../asset/sounds/kick02.wav";
import kick03 from "../asset/sounds/kick03.wav";
import hihat from "../asset/sounds/hihat.wav";
import openhat from "../asset/sounds/openhat.wav";
import closhat from "../asset/sounds/closeHat.wav";
import pedalhat from "../asset/sounds/pedalHat.wav";
import percussion01 from "../asset/sounds/percussion01.wav";
import percussion02 from "../asset/sounds/percussion02.wav";
import percussion03 from "../asset/sounds/percussion03.wav";
import reversehat from "../asset/sounds/reverseHat.wav";
import ride01 from "../asset/sounds/ride01.wav";
import ride02 from "../asset/sounds/ride02.wav";
import scratch from "../asset/sounds/scratch.wav";
import snare01 from "../asset/sounds/snare01.wav";
import snare02 from "../asset/sounds/snare02.wav";
import snareSide from "../asset/sounds/snareSide.wav";
import tom01 from "../asset/sounds/tom01.wav";
import tom02 from "../asset/sounds/tom02.wav";
import tom03 from "../asset/sounds/tom03.wav";

export default () => {
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    const soundPlayer = new Tone.Players(
      {
        q: percussion01,
        w: percussion02,
        e: percussion03,
        r: snareSide,
        t: crash01,
        y: crash02,
        u: clap01,
        i: clap02,
        o: ride01,
        p: ride02,
        a: hihat,
        s: reversehat,
        d: snare01,
        f: snare02,
        g: kick03,
        h: kick02,
        j: brush01,
        k: brush02,
        l: tink,
        z: pedalhat,
        x: closhat,
        c: openhat,
        v: kick01,
        b: tom01,
        n: tom02,
        m: tom03,
        ";": scratch,
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
