import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

const userID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

const ModalCover = styled.div`
  top: 0;
  position: fixed;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 80vw;
  height: 70vh;
  display: flex;
`;

const ModalContentVisual = styled.div`
  flex-basis: 60%;
`;

const ModalContentText = styled.div`
  flex-basis: 30%;
  overflow: scroll;
`;

const ModalText = styled.p`
  margin-top: 5vh;
`;

const ModalCloseButton = styled.button`
  flex-basis: 5%;
  background-color: red;
  height: 2rem;
  cursor: pointer;
`;

const TagsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TagWrapper = styled.div`
  background-color: gray;
  color: white;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  margin: 0.5rem;
  display: flex;
`;

const Img = styled.img`
  width: 50px;
  border-radius: 50%;
`;

export default function WorkModal({ workModalID, setWorkModalID }) {
  const [work, setWork] = useState({});
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const [collect, setCollect] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    Firebase.getWork(workModalID).then((data) => {
      setLike(data.liked_by.includes(userID));
      setCollect(data.collected_by.includes(userID));
      setWork(data);
    });
  }, []);

  useEffect(() => {
    const onSnapshotComments = Firebase.onSnapshotComments(
      workModalID,
      async (snapshot) => {
        const result = await Promise.all(
          snapshot.docs.map(async (item) => {
            const authorInfo = await Firebase.getUserBasicInfo(
              item.data().author_id
            );
            return {
              id: item.id,
              ...item.data(),
              ...authorInfo,
            };
          })
        );
        setComments(result);
      }
    );
    return () => {
      onSnapshotComments();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  function sendComment() {
    const count = comments.length + 1 || 0;
    Firebase.addComment(userID, workModalID, input, count).then(() => {
      setInput("");
    });
  }

  function handleLike(id, list) {
    if (!like) {
      Firebase.likeWork(userID, id, list).then(() => {
        setLike(!like);
      });
      return;
    }

    Firebase.unlikeWork(userID, id, list).then(() => {
      setLike(!like);
    });
  }
  function handleCollect(id, list) {
    if (!collect) {
      Firebase.collectWork(userID, id, list).then(() => {
        setCollect(!collect);
      });
      return;
    }

    Firebase.uncollectWork(userID, id, list).then(() => {
      setCollect(!collect);
    });
  }

  return (
    <ModalCover>
      <ModalContent>
        <ModalContentVisual>
          <div key={work.id}>
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
            <ModalText>{work.description}</ModalText>
            <TagsContainer>
              {work.tags?.map((tag) => (
                <TagWrapper key={tag}>{tag}</TagWrapper>
              ))}
            </TagsContainer>

            <button onClick={() => handleLike(work.id, work.liked_by)}>
              {`${like ? "liked" : "like"}`}
            </button>
            <button onClick={() => handleCollect(work.id, work.collected_by)}>
              {`${collect ? "collected" : "collect"}`}
            </button>
          </div>
        </ModalContentVisual>
        <ModalContentText>
          {comments.map((comment) => {
            return (
              <div key={comment.id}>
                <Img src={comment.author_thumbnail} />
                <p>{comment.author_name}</p>
                <p>{comment.content}</p>
              </div>
            );
          })}
          <>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button onClick={sendComment}>send</button>
          </>
          <div ref={endRef}></div>
        </ModalContentText>
        <ModalCloseButton
          onClick={() => {
            setWorkModalID("");
          }}
        >
          X
        </ModalCloseButton>
      </ModalContent>
    </ModalCover>
  );
}
