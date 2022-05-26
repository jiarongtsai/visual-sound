import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Firebase } from "../../utils/firebase";
import Gallery from "./Gallery";
import { EmptyHandle } from "../EmptyHandle";

export default function IntersectionGallery({
  term,
  currentUserID,
  isCurrentUser,
}) {
  let isFetching = false;
  const [works, setWorks] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  const navigate = useNavigate();

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

  if (isCurrentUser && works.length === 0)
    return (
      <>
        <EmptyHandle
          showText="No works yet"
          buttonText="Create"
          link="/create"
        />
        <div ref={endofPageRef}></div>
      </>
    );

  if (currentUserID && works.length === 0)
    return (
      <>
        <EmptyHandle
          showText="No works yet"
          buttonText="Explore other pages"
          link="/explore"
        />
        <div ref={endofPageRef}></div>
      </>
    );

  if (works.length === 0)
    return (
      <>
        <EmptyHandle
          showText="No works found"
          buttonText="Back to Explore"
          link="/explore"
        />
        <div ref={endofPageRef}></div>
      </>
    );

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
