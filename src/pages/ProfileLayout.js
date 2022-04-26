import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Outlet, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
import { AuthContext } from "../components/auth/Auth";

const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
export default function ProfileLayout() {
  const [profile, setProfile] = useState({});
  const user = useContext(AuthContext);

  useEffect(() => {
    Firebase.getProfile(user.uid).then((data) => setProfile(data));
  }, []);

  return (
    <>
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
        <button>edit profile</button>
      </div>
      <Nav>
        <div>followers {profile.followers?.length || 0}</div>
        <div>following {profile.following?.length || 0}</div>
      </Nav>
      <hr />
      <Nav>
        <Link to="">Work</Link>
        <Link to="collection">Collection</Link>
      </Nav>
      <Outlet />
    </>
  );
}
