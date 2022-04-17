import { useState, useEffect, useRef } from "react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";

export default function Explore() {
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  const [workModalID, setWorkModalID] = useState("");
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = true;

  useEffect(() => {
    Firebase.getAllworks().then(({ allworks, lastVisibleWork }) => {
      setExploreworks(allworks);
      pagingRef.current = lastVisibleWork;
      isFetching = false;
    });
  }, []);

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (!pagingRef.current) return;
      isFetching = true;
      Firebase.LoadingNextWorks(pagingRef.current).then(
        ({ allworks, lastVisibleWork }) => {
          setExploreworks((pre) => [...pre, ...allworks]);
          if (allworks.length < 5) {
            pagingRef.current = null;
            return;
          }
          pagingRef.current = lastVisibleWork;
          isFetching = false;
        }
      );
    });
    pagingObserver.observe(endofPageRef.current);
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
      <div ref={endofPageRef}></div>
    </>
  );
}
