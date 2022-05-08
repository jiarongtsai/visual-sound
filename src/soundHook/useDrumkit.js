import { useState, useEffect } from "react";
import * as Tone from "tone";
import kick_01 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Kick_02.wav";
import kick_02 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Kick_01.wav";
import snare_01 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Snr_02.wav";
import snareSide from "../asset/DrumKit_3_Acoustic/CyCdh_K3SdSt_03.wav";
import tomHigh from "../asset/DrumKit_3_Acoustic/CyCdh_K3Tom_01.wav";
import tomMid from "../asset/DrumKit_3_Acoustic/CyCdh_K3Tom_04.wav";
import tomLow from "../asset/DrumKit_3_Acoustic/CyCdh_K3Tom_05.wav";
import clap_01 from "../asset/DrumKit5_Electro/CYCdh_ElecK02_Clap01.wav";
import clap_02 from "../asset/DrumKit5_Electro/CYCdh_ElecK02_Clap02.wav";
import closeHat_01 from "../asset/DrumKit_3_Acoustic/CyCdh_K3ClHat_01.wav";
import closeHat_02 from "../asset/DrumKit_3_Acoustic/CyCdh_K3ClHat_04.wav";
import halfHat from "../asset/DrumKit_3_Acoustic/CyCdh_K3HfHat.wav";
import openHat_01 from "../asset/DrumKit_3_Acoustic/CyCdh_K3OpHat_01.wav";
import openHat_02 from "../asset/DrumKit_3_Acoustic/CyCdh_K3OpHat_03.wav";
import openHat_03 from "../asset/DrumKit_3_Acoustic/CyCdh_K3OpHat_02.wav";
import rim from "../asset/DrumKit_3_Acoustic/CyCdh_K3Rim_01.wav";
import crashCymbal_01 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_03.wav";
import crashCymbal_02 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_01.wav";
import crashCymbal_03 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_04.wav";
import crashCymbal_04 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_05.wav";
import crashCymbal_05 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_02.wav";
import crashCymbal_06 from "../asset/DrumKit_3_Acoustic/CyCdh_K3Crash_07.wav";

//   useEffect(() => {
//     sampler.current = new Tone.Sampler(
//       { A1 },
//       {
//         onload: () => {
//           setLoaded(true);
//         },
//       }
//     ).toDestination();

//     const unSchedule = Tone.Transport.scheduleRepeat(function (time) {
//       drumKitPlayer && drumKitPlayer.player("a").start(time + 0);
//       //   drumKitPlayer && drumKitPlayer.player("f").start(time + "8n");
//       //   drumKitPlayer && drumKitPlayer.player("h").start(time + "4n");
//       //   drumKitPlayer && drumKitPlayer.player("k").start(time + "1m");
//       //   drumKitPlayer && drumKitPlayer.player("i").start();
//       //   drumKitPlayer && drumKitPlayer.player("l").start(4.5);
//       //   drumKitPlayer && drumKitPlayer.player("r").start(5.5);
//       //   sampler.current.triggerAttackRelease("A1", 3);
//       console.log(time, drumKitPlayer);
//     }, "2m");

//     return unSchedule;
//   }, [drumKitPlayer]);

export default () => {
  const [drumKitPlayer, setDrumKitPlayer] = useState(null);
  useEffect(() => {
    const soundPlayer = new Tone.Players(
      {
        b: kick_01,
        n: kick_01,
        a: closeHat_01,
        s: closeHat_02,
        d: halfHat,
        z: openHat_01,
        x: openHat_02,
        c: openHat_03,
        v: kick_02,
        f: snare_01,
        g: snare_01,
        q: clap_01,
        w: clap_02,
        e: rim,
        r: snareSide,
        h: tomHigh,
        j: tomHigh,
        k: tomMid,
        l: tomMid,
        m: tomLow,
        ",": tomLow,
        t: crashCymbal_01,
        y: crashCymbal_02,
        u: crashCymbal_03,
        i: crashCymbal_04,
        o: crashCymbal_05,
        p: crashCymbal_06,

        // j: openHat,
        // ";": rideCymbal,
        // l: crashCymbal,
      },
      () => {
        console.log("drumKit loaded");
        setDrumKitPlayer(soundPlayer);
      }
    ).toDestination();
    return () => {
      soundPlayer.dispose();
      soundPlayer.disconnect();
    };
  }, []);
  return drumKitPlayer;
};
