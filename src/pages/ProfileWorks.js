import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../components/auth/Auth";
import { Firebase } from "../utils/firebase";
import Gallery from "../components/Gallery";

export default function ProfileWorks() {
  const user = useContext(AuthContext);
  const [userWorks, setUserWorks] = useState([]);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (typeof pagingRef.current === "undefined") return;
      isFetching = true;
      Firebase.getWorks(pagingRef.current, null, user.uid).then(
        ({ fetchWorks, lastVisibleWork }) => {
          setUserWorks((pre) => [...pre, ...fetchWorks]);
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
  }, []);
  return (
    <>
      <Gallery works={userWorks} isShown={isShown} setIsShown={setIsShown} />
      <div ref={endofPageRef}></div>
    </>
  );
}
