import { React, useState, useEffect } from "react";
import useSound from "use-sound";
import boom from "../asset/sounds/boom.wav";
import clap from "../asset/sounds/clap.wav";
import hihat from "../asset/sounds/hihat.wav";
import kick from "../asset/sounds/kick.wav";
import openhat from "../asset/sounds/openhat.wav";
import ride from "../asset/sounds/ride.wav";
import snare from "../asset/sounds/snare.wav";
import tink from "../asset/sounds/tink.wav";
import tom from "../asset/sounds/tom.wav";

const allTrack = [
  { sound: boom, name: "boom" },
  { sound: clap, name: "clap" },
  { sound: hihat, name: "hihat" },
  { sound: kick, name: "kick" },
  { sound: openhat, name: "openhat" },
  { sound: ride, name: "ride" },
  { sound: snare, name: "snare" },
  { sound: tink, name: "tink" },
  { sound: tom, name: "tom" },
];

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

//button
const BoopButton = (props) => {
  const [play] = useSound(props.sound);
  return <button onClick={play}>{props.soundName}</button>;
};

export default function Main() {
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
  function handleKeydown() {
    window.addEventListener(
      "keydown",
      (event) => {
        setKeydown(`key='${event.key}' | code='${event.code}'`);
      },
      true
    );
  }
  handleKeydown();

  return (
    <>
      <div>{keydown}</div>
      {allTrack.map((sound) => {
        return (
          <BoopButton
            sound={sound.sound}
            soundName={sound.name}
            key={sound.name}
          />
        );
      })}
    </>
  );
}
