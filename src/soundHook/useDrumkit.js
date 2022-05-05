import { useState, useEffect } from "react";
import * as Tone from "tone";
import kick from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Kick01.wav";
import snare_01 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Snr01.wav";
import snare_02 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Snr02.wav";
import snare_03 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Snr03.wav";
import tom_01 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Tom01.wav";
import tom_02 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Tom02.wav";
import tom_03 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_Tom03.wav";
import clap_01 from "../asset/DrumKit5_Electro/CYCdh_ElecK02_Clap01.wav";
import clap_02 from "../asset/DrumKit5_Electro/CYCdh_ElecK02_Clap02.wav";

import pedalHat from "../asset/DrumKit6_Electro/CYCdh_ElecK03_PdHat.wav";
import openHat from "../asset/DrumKit6_Electro/CYCdh_ElecK03_OpHat.wav";
import closeHat from "../asset/DrumKit6_Electro/CYCdh_ElecK03_ClHat.wav";
// import FX_01 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_FX01.wav";
// import FX_02 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_FX02.wav";
// import FX_03 from "../asset/DrumKit4_Electro/CYCdh_ElecK01_FX03.wav";
import rideCymbal from "../asset/DrumKit7_Electro/CYCdh_ElecK04_Cymbal01.wav";
import crashCymbal from "../asset/DrumKit7_Electro/CYCdh_ElecK04_Cymbal02.wav";

export default () => {
  const [drumKitPlayer, setDrumKitPlayer] = useState(null);
  useEffect(() => {
    const soundPlayer = new Tone.Players(
      {
        z: kick,
        f: kick,
        a: clap_01,
        k: clap_02,
        x: snare_01,
        c: snare_01,
        s: snare_03,
        d: snare_02,
        v: tom_01,
        b: tom_01,
        n: tom_02,
        m: tom_02,
        mr: tom_03,
        mrr: tom_03,
        g: closeHat,
        h: pedalHat,
        j: openHat,
        lr: rideCymbal,
        l: crashCymbal,
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
