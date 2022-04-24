import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { GridWrapper } from "../components/element/GridWrapper";
import { Thumbnail } from "../components/element/Thumbnail";
import { Img } from "../components/element/Img";
import styled from "styled-components";

const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export default function User() {
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const { uid } = useParams();
  const location = useLocation();

  useEffect(() => {
    Firebase.getProfile(uid).then((data) => setProfile(data));

    Firebase.getUserWorks(uid).then((data) => {
      setUserWorks(data);
    });
  }, []);

  return (
    <>
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <div>
        <Nav>
          <div>followers {profile.followers?.length || 0}</div>
          <div>following {profile.following?.length || 0}</div>
        </Nav>
        <Nav>
          <button>follow {profile.user_name}</button>
          <button>chat with {profile.user_name}</button>
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
