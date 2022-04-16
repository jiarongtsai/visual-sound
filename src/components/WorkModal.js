import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

console.clear();
const UserID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

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
  const endRef = useRef(null);

  useEffect(() => {
    Firebase.getWork(workModalID).then((data) => setWork(data));
    const queryCondition = query(
      collection(Firebase.db(), `works/${workModalID}/comments`),
      orderBy("created_time")
    );
    const docsSnap = onSnapshot(queryCondition, async (snapshot) => {
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
    });
    return () => {
      docsSnap();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  function sendComment() {
    const count = comments.length + 1 || 0;
    Firebase.addComment(UserID, workModalID, input, count).then(() => {
      setInput("");
    });
  }

  return (
    <ModalCover>
      <ModalContent>
        <ModalContentVisual>
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