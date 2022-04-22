import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function User() {
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const [workModalID, setWorkModalID] = useState("");
  const userID = window.location.pathname.slice(6);

  useEffect(() => {
    Firebase.getProfile(userID).then((data) => setProfile(data));

    Firebase.getUserWorks(userID).then((data) => {
      setUserWorks(data);
    });
  }, []);

  return (
    <>
      {workModalID ? (
        <WorkModal workModalID={workModalID} setWorkModalID={setWorkModalID} />
      ) : (
        ""
      )}
      <div>
        <Img src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
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
            <br />
            <button onClick={() => setWorkModalID(work.id)}>more</button>
          </div>
        );
      })}
    </>
  );
}
