import { useState, useEffect } from "react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  const [workModalID, setWorkModalID] = useState("");
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
      {workModalID ? (
        <WorkModal workModalID={workModalID} setWorkModalID={setWorkModalID} />
      ) : (
        ""
      )}
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
            <br />
            <button onClick={() => setWorkModalID(work.id)}>more</button>
          </div>
        );
      })}
    </>
  );
}
