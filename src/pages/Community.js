import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import { AuthContext } from "../auth/Auth";
import { Thumbnail } from "../components/element/Thumbnail";

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export default function Community() {
  const user = useContext(AuthContext);
  const location = useLocation();
  const [allworks, setAllworks] = useState([]);
  const [like, setLike] = useState([]);
  const [collect, setCollect] = useState([]);

  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setAllworks(data);
      data.forEach((item) => {
        if (item.liked_by.includes(user.uid)) {
          setLike((pre) => [...pre, true]);
        } else {
          setLike((pre) => [...pre, false]);
        }
        if (item.collected_by.includes(user.uid)) {
          setCollect((pre) => [...pre, true]);
        } else {
          setCollect((pre) => [...pre, false]);
        }
      });
    });
  }, []);

  function handleLike(id, i, list) {
    if (!like[i]) {
      Firebase.likeWork(user.uid, id, list).then(() => {
        const newLikeList = [...like];
        newLikeList[i] = !newLikeList[i];
        setLike(newLikeList);
      });
      return;
    }

    Firebase.unlikeWork(user.uid, id, list).then(() => {
      const newLikeList = [...like];
      newLikeList[i] = !newLikeList[i];
      setLike(newLikeList);
    });
  }

  function handleCollect(id, i, list) {
    if (!collect[i]) {
      Firebase.collectWork(user.uid, id, list).then(() => {
        const newCollectList = [...collect];
        newCollectList[i] = !newCollectList[i];
        setCollect(newCollectList);
      });
      return;
    }
    Firebase.uncollectWork(user.uid, id, list).then(() => {
      const newCollectList = [...collect];
      newCollectList[i] = !newCollectList[i];
      setCollect(newCollectList);
    });
  }
  return (
    <>
      {allworks.map((work, i) => {
        return (
          <div
            style={{ width: "70vw", padding: "0 2rem", margin: "2rem auto" }}
            key={work.id}
          >
            <Div>
              <Thumbnail src={work.author_thumbnail} />
              <p>{work.author_name}</p>
            </Div>
            <Link
              style={{ cursor: "pointer" }}
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <PlayerProvider>
                {({ soundPlayer }) => {
                  return (
                    <SequencePlayer
                      player={soundPlayer}
                      sheetmusic={work.sheetmusic}
                      bpm={work.bpm}
                      themeColor={work.themeColor}
                    />
                  );
                }}
              </PlayerProvider>
            </Link>
            <div>
              <button onClick={() => handleLike(work.id, i, work.liked_by)}>
                {`${like[i] ? "liked" : "like"}`}
              </button>
              <button
                onClick={() => handleCollect(work.id, i, work.collected_by)}
              >
                {`${collect[i] ? "collected" : "collect"}`}
              </button>
              {/* <button onClick={() => setWorkModalID(work.id)}>
                  Add a comment
                </button> */}
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
              <Link
                style={{ cursor: "pointer" }}
                to={`/work/${work.id}`}
                state={{ backgroundLocation: location }}
              >{`view all ${work.comments_count} comments`}</Link>
              <br />
            </div>
            <p>{work.created_time.toDate().toDateString()}</p>
          </div>
        );
      })}
    </>
  );
}
