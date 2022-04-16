import { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import WorkModal from "../components/WorkModal";
import {
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  getDocs,
  collection,
} from "firebase/firestore";

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
    (async () => {
      const followingList = await Firebase.getFollowingList(userID);
      const queryCondition = query(
        Firebase.worksRef(),
        where("author_id", "in", followingList),
        orderBy("created_time", "desc"),
        limit(20)
      );
      const docsSnap = onSnapshot(queryCondition, async (snapshot) => {
        const result = await Promise.all(
          snapshot.docs.map(async (item) => {
            const authorInfo = await Firebase.getUserBasicInfo(
              item.data().author_id
            );
            const queryComment = query(
              collection(Firebase.db(), `works/${item.id}/comments`),
              orderBy("created_time", "desc"),
              limit(2)
            );
            const latestComments = await getDocs(queryComment);
            const result = latestComments.docs.map((doc) => {
              return doc.data();
            });
            console.log(result);
            return {
              id: item.id,
              ...item.data(),
              ...authorInfo,
            };
          })
        );
        setAllworks(result);
      });
    })();

    return () => {
      // docsSnap();
    };
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
                {work.commentsLatest &&
                  work.commentsLatest.map((comment) => {
                    return (
                      <div key={work.id}>
                        <span>
                          <strong>{comment.name}</strong>
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
