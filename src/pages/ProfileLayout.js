import { useState, useEffect } from "react";
import styled from "styled-components";
import { Outlet, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

export default function ProfileLayout() {
  const [profile, setProfile] = useState({});

  const Nav = styled.div`
    display: flex;
    justify-content: space-evenly;
  `;

  useEffect(() => {
    Firebase.getProfile(userID).then((data) => setProfile(data));
  }, []);

  return (
    <>
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <hr />
      <Nav>
        <Link to="">Work</Link>
        <Link to="collection">Collection</Link>
      </Nav>
      <Outlet />
    </>
  );
}
