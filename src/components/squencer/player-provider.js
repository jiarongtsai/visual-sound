import { useState, useEffect } from "react";
import * as Tone from "tone";

const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    const newPlayer = new Tone.Players(
      {
        BD: "/kick.wav",
        CP: "/clap.wav",
        OH: "/hh_open.wav",
        CH: "/hh_closed.wav",
      },
      () => {
        console.log("buffers loaded");
        setPlayer(newPlayer);
      }
    ).toDestination();
  }, []);

  return children({ player });
};

export default PlayerProvider;
