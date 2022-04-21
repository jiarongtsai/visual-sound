import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
  let isFetching = false;

  const [searchParams, setSearchParams] = useSearchParams();
  let queryTerm = searchParams.get("query");

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      isFetching = true;

      function fetchWorks() {
        if (queryTerm) {
          return Firebase.searchWorks(queryTerm, pagingRef.current);
        }
        return Firebase.getAllworks(pagingRef.current);
      }

      fetchWorks().then(({ fetchWorks, lastVisibleWork }) => {
        setExploreworks((pre) => [...pre, ...fetchWorks]);
        pagingRef.current = lastVisibleWork;
        isFetching = false;
      });
    });
    pagingObserver.observe(endofPageRef.current);
    return () => {
      endofPageRef.current && pagingObserver.unobserve(endofPageRef.current);
    };
  }, [queryTerm]);

  function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let newQuery = formData.get("query");
    if (!newQuery) return;
    pagingRef.current = null;
    setSearchParams({ query: newQuery });
    setExploreworks([]);
  }

  return (
    <>
      {workModalID ? (
        <WorkModal workModalID={workModalID} setWorkModalID={setWorkModalID} />
      ) : (
        ""
      )}
      <div>Explore</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          name="query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Search</button>
      </form>
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
                    themeColor={work.themeColor}
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
