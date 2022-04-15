import { useState, useEffect } from "react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  useEffect(() => {
    Firebase.getAllworks().then((data) => setExploreworks(data));
  }, []);

  return (
    <>
      <div>Explore</div>
      <input />
      <button>Search</button>
      {exploreworks.map((work, i) => {
        return (
          <div key={i}>
            <PlayerProvider>
              {({ soundPlayer }) => {
                return (
                  <SequencePlayer
                    player={soundPlayer}
                    sheetmusic={work.sheetmusic}
                    bpm={work.bpm}
                  />
                );
              }}
            </PlayerProvider>
          </div>
        );
      })}
    </>
  );
}
