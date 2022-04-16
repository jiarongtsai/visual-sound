import { useState, useEffect } from "react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    Firebase.getAllworks().then((data) => setExploreworks(data));
  }, []);

  function handleSearch() {
    Firebase.searchWorks(input).then((data) => {
      setExploreworks(data);
      setInput("");
    });
  }

  return (
    <>
      <div>Explore</div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
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
