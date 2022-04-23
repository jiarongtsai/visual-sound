import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import SequenceMotion from "../components/SequenceMotion";
import { GridWrapper, Square } from "../components/GridWrapper";
import { Img } from "../components/element/Img";

export default function Explore() {
  let location = useLocation();
  const [exploreworks, setExploreworks] = useState([]);
  const [input, setInput] = useState("");
  const [alltags, setAlltags] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;

  const [searchParams, setSearchParams] = useSearchParams();
  let queryTerm = searchParams.get("query");

  useEffect(() => {
    Firebase.getAllTags().then((data) => {
      setAlltags(data);
    });
  }, []);

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
        console.log(fetchWorks.length);
        setIsShown((pre) => [...pre, ...Array(fetchWorks.length).fill(false)]);
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
    setIsShown([]);
  }
  return (
    <>
      <div>Explore</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          name="query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          list="opts"
        />
        <datalist id="opts">
          {alltags.map((tag, i) => (
            <option key={i}>{tag}</option>
          ))}
        </datalist>
        <button>Search</button>
      </form>
      <GridWrapper>
        {exploreworks.map((work, i) => {
          return (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <Square style={{ display: isShown[i] ? "block" : "none" }}>
                <SequenceMotion
                  sheetmusic={work.sheetmusic}
                  bpm={work.bpm}
                  themeColor={work.themeColor}
                />
              </Square>
              <Img
                src={work.image_url}
                onMouseEnter={() =>
                  setIsShown((pre) => [
                    ...pre.slice(0, i),
                    true,
                    ...pre.slice(i + 1),
                  ])
                }
                onMouseLeave={() =>
                  setIsShown((pre) => [
                    ...pre.slice(0, i),
                    false,
                    ...pre.slice(i + 1),
                  ])
                }
              />
            </Link>
          );
        })}
      </GridWrapper>
      <div ref={endofPageRef}></div>
    </>
  );
}
