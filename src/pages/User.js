import { useState, useEffect, useContext } from "react";
import {
  useParams,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/element/GridWrapper";
import { Thumbnail } from "../components/element/Thumbnail";
import { Img } from "../components/element/Img";
import styled from "styled-components";
import { AuthContext } from "../components/auth/Auth";

const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export default function User() {
  const user = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const { uid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentFollowers, setCurrentFollowers] = useState(0);

  useEffect(() => {
    Firebase.getProfile(uid).then((data) => {
      setProfile(data);
      setIsFollowing(data.followers.includes(user?.uid));
      setCurrentFollowers(data.followers?.length || 0);
    });

    Firebase.getUserWorks(uid).then((data) => {
      setUserWorks(data);
    });
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
      console.log(mid);
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
      <GridWrapper>
        {userWorks.map((work) => {
          return (
            <Link
              key={work.id}
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <Img src={work.image_url} />
            </Link>
          );
        })}
      </GridWrapper>
    </>
  );
}
