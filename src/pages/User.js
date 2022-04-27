import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
import styled from "styled-components";
import { AuthContext } from "../components/auth/Auth";
import Gallery from "../components/Gallery";

const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export default function User() {
  const user = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const { uid } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentFollowers, setCurrentFollowers] = useState(0);
  const [isShown, setIsShown] = useState([]);
  const endofPageRef = useRef();
  const pagingRef = useRef(null);
  let isFetching = false;

  useEffect(() => {
    if (user?.uid === uid) {
      console.log(user.uid, uid);
      navigate(`/profile`);
    }
    Firebase.getProfile(uid).then((data) => {
      setProfile(data);
      setIsFollowing(data.followers.includes(user?.uid));
      setCurrentFollowers(data.followers?.length || 0);
    });
  }, []);

  useEffect(() => {
    const pagingObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      if (isFetching) return;
      if (typeof pagingRef.current === "undefined") return;
      isFetching = true;
      Firebase.getWorks(pagingRef.current, null, uid).then(
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

  function handleFollow() {
    if (!isFollowing) {
      Firebase.followUser(user.uid, uid, profile.followers).then(() => {
        setIsFollowing(true);
        setCurrentFollowers((v) => v + 1);
      });
      return;
    }
    Firebase.unfollowUser(user.uid, uid, profile.followers).then(() => {
      setIsFollowing(false);
      setCurrentFollowers((v) => v - 1);
    });
  }

  function handleChat() {
    Firebase.getChatroom(user.uid, uid).then((mid) => {
      navigate(`/message/${mid}`);
    });
  }

  return (
    <>
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <div>
        <Nav>
          <div>followers {currentFollowers}</div>
          <div>following {profile.following?.length || 0}</div>
        </Nav>
        <Nav>
          <button onClick={handleFollow}>
            {!isFollowing ? "follow" : "unfollow"}
          </button>

          <button onClick={handleChat}>chat with {profile.user_name}</button>
        </Nav>
      </div>
      <hr />
      <Gallery works={userWorks} isShown={isShown} setIsShown={setIsShown} />
      <div ref={endofPageRef}></div>
    </>
  );
}
