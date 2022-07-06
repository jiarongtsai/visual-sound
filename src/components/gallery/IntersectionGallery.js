import { useState, useRef, useEffect } from "react";

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

  useEffect(() => {
    if (term || currentUserID) {
      pagingRef.current = null;
      setWorks([]);
      setIsShown([]);
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
  }, [term, currentUserID]);

  if (isCurrentUser && works.length === 0)
    return (
      <>
        <EmptyHandle showText="No works yet" buttonText="Create" link="/" />
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
