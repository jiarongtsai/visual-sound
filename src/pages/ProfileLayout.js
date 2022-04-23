import { useState, useEffect } from "react";
import styled from "styled-components";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";
import { Outlet, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

const Block = styled.div`
  display: ${(props) => props.display};
`;

export default function ProfileLayout() {
  const [profile, setProfile] = useState({});
  const [userWorks, setUserWorks] = useState([]);
  const [collectedWorks, setCollectedWorks] = useState([]);
  const [workModalID, setWorkModalID] = useState("");
  const [tab, setTab] = useState(0);
  //0: userWork, 1:collectedWork

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
        <Img src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
      </div>
      <hr />
      <Nav>
        <Link to="">Work</Link>
        <Link to="collection">Collection</Link>
      </Nav>
      <Outlet />
      {/* <Block display={`${tab === 0 ? "initial" : "none"}`}>
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
      </Block>
      <Block display={`${tab === 1 ? "initial" : "none"}`}>
        {collectedWorks.map((work, i) => {
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
      </Block> */}
    </>
  );
}
