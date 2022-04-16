import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";

const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export default function Community() {
  const [allworks, setAllworks] = useState([]);
  const [workModalID, setWorkModalID] = useState("");
  useEffect(() => {
    Firebase.getFollowingWorks(userID).then((data) => {
      setAllworks(data);
    });
  }, []);
  return (
    <>
      {workModalID ? (
        <WorkModal workModalID={workModalID} setWorkModalID={setWorkModalID} />
      ) : (
        ""
      )}
      {allworks.map((work) => {
        return (
          <div
            key={work.id}
            style={{ width: "70vw", padding: "0 2rem", margin: "2rem auto" }}
          >
            <Div>
              <Img src={work.author_thumbnail} />
              <p>{work.author_name}</p>
            </Div>
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
            <div>
              <span>❤️</span>
              <span>💬</span>
              <span>⭐️</span>
            </div>
            <Div>
              <h3>{work.author_name}</h3>
              <p>{work.description}</p>
            </Div>
            <div>
              <div>
                {work.latestComments?.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <span>
                        <strong>{comment.author_name}</strong>
                      </span>
                      <span>{comment.content}</span>
                    </div>
                  );
                })}
              </div>
              <a
                style={{ cursor: "pointer" }}
                onClick={() => setWorkModalID(work.id)}
              >{`view all ${work.comments_count} comments`}</a>
            </div>
            <p>{work.created_time.toDate().toDateString()}</p>
          </div>
        );
      })}
    </>
  );
}
