import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { Container, useColorModeValue } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import { AuthContext } from "../components/auth/Auth";
import { Thumbnail } from "../components/element/Thumbnail";
import CommunityCard from "../components/CommunityCard";

export default function Community() {
  const user = useContext(AuthContext);
  const location = useLocation();
  const [allworks, setAllworks] = useState([]);
  const [like, setLike] = useState([]);

  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setAllworks(data);
      data.forEach((item) => {
        if (item.liked_by.includes(user.uid)) {
          setLike((pre) => [...pre, true]);
        } else {
          setLike((pre) => [...pre, false]);
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

  if (allworks.length === 0)
    return <div>Go 'Explore' to follow more users</div>;
  return (
    <Container mt={16}>
      {allworks.map((work, i) => (
        <CommunityCard
          key={work.id}
          work={work}
          i={i}
          like={like}
          handleLike={handleLike}
          location={location}
        />
      ))}
      {/* {allworks.map((work, i) => {
        return (
          <div
            style={{ width: "70vw", padding: "0 2rem", margin: "2rem auto" }}
            key={work.id}
          >
            <Link
              style={{ cursor: "pointer" }}
              to={`/user/${work.author_id}`}
              state={{ backgroundLocation: location }}
            >
              <Div>
                <Thumbnail src={work.author_thumbnail} />
                <p>{work.author_name}</p>
              </Div>
            </Link>
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

              <CollectWithCategory
                id={work.id}
                collectedList={work.collected_by}
              />
              {/* <button onClick={() => setWorkModalID(work.id)}>
                  Add a comment
                </button> */}
      {/*}  </div>
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
      })} */}
    </Container>
  );
}
