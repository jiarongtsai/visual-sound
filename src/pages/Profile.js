import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import Header from "../components/Header";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function Profile() {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    Firebase.getProfile("oWhlyRTSEMPFknaRnA5MNNB8iZC2").then((data) =>
      setProfile(data)
    );
  }, []);

  return (
    <>
      <Header />
      <div>
        <Img src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <hr />
    </>
  );
}
