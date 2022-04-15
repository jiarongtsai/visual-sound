import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
console.clear();
const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  useEffect(() => {
    Firebase.getProfile(userID).then((data) => setProfile(data));

    Firebase.getUserWorks(userID).then((data) => {
      setUserWorks(data);
    });
  }, []);

  return (
    <>
      <div>
        <Img src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <hr />
      <div>
        {userWorks.map((work, i) => {
          return (
            <div key={i}>
              <PlayerProvider>
                {({ soundPlayer }) => {
                  return (
                    <SequencePlayer
                      player={soundPlayer}
                      sheetmusic={work.sheetmusic}
                      bpm={work.bpm}
                    />
                  );
                }}
              </PlayerProvider>
            </div>
          );
        })}
      </div>
    </>
  );
}
