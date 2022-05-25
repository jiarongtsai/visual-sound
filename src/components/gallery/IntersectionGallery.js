import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Firebase } from "../../utils/firebase";
import Gallery from "./Gallery";

export default function IntersectionGallery({ term, currentUserID }) {
  let isFetching = false;
  const [works, setWorks] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  useEffect(() => {
    if (term) {
      pagingRef.current = null;
      setWorks([]);
      setIsShown([]);
      //might have error when query term have more than one page
    }

    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (pagingRef.current === undefined) return;
      isFetching = true;
      Firebase.getWorks(pagingRef.current, term, currentUserID).then(
        ({ fetchWorks, lastVisibleWork }) => {
          setWorks((pre) => [...pre, ...fetchWorks]);
          setIsShown((pre) => [
            ...pre,
            ...Array(fetchWorks.length).fill(false),
          ]);
          pagingRef.current = lastVisibleWork;
          isFetching = false;
        }
      );
    });
    pagingObserver.observe(endofPageRef.current);
    return () => {
      endofPageRef.current && pagingObserver.unobserve(endofPageRef.current);
    };
  }, [term]);

  return (
    <>
      <Gallery works={works} isShown={isShown} setIsShown={setIsShown} />
      <div ref={endofPageRef}></div>
    </>
  );
}

IntersectionGallery.propTypes = {
  term: PropTypes.string,
  currentUserID: PropTypes.string,
};
