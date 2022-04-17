import { useState, useEffect } from "react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  const [workModalID, setWorkModalID] = useState("");
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    Firebase.getAllworks().then(({ allworks, lastVisibleWork }) => {
      setExploreworks(allworks);
      setLastVisible(lastVisibleWork);
    });
  }, []);

  function handleSearch() {
    Firebase.searchWorks(input).then((data) => {
      setExploreworks(data);
      setInput("");
    });
  }

  function handleLoadingData(lastVisibleData) {
    Firebase.LoadingNextWorks(lastVisibleData).then(
      ({ allworks, lastVisibleWork }) => {
        setExploreworks([...exploreworks, ...allworks]);
        if (allworks.length < 5) {
          setLastVisible(null);
          return;
        }
        setLastVisible(lastVisibleWork);
      }
    );
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
      <button onClick={() => handleLoadingData(lastVisible)}>{`${
        lastVisible ? "Load More" : "No More Data"
      }`}</button>
    </>
  );
}
