import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { onSnapshot, collection } from "firebase/firestore";
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
  width: 70vw;
  height: 70vh;
  overflow: scroll;
`;

const ModalText = styled.p`
  margin-top: 5vh;
`;

const ModalCloseButton = styled.button`
  background-color: red;
  width: 10vw;
  height: 5vh;
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
  useEffect(() => {
    Firebase.getWork(workModalID).then((data) => setWork(data));
    //snapshot
    const docsRef = collection(Firebase.db(), `works/${workModalID}/comments`);
    const docsSnap = onSnapshot(docsRef, async (snapshot) => {
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

  function sendComment() {
    const count = comments.length + 1 || 0;
    Firebase.addComment(UserID, workModalID, input, count).then(() => {
      setInput("");
    });
  }

  return (
    <ModalCover>
      <ModalContent>
        {/* <PlayerProvider>
          {({ soundPlayer }) => {
            return (
              <SequencePlayer
                player={soundPlayer}
                sheetmusic={work.sheetmusic}
                bpm={work.bpm}
              />
            );
          }}
        </PlayerProvider> */}
        <ModalText>{work.description}</ModalText>
        <TagsContainer>
          {work.tags?.map((tag) => (
            <TagWrapper key={tag}>{tag}</TagWrapper>
          ))}
        </TagsContainer>
        <>
          {comments.map((comment) => {
            return (
              <div key={comment.id}>
                <Img src={comment.author_thumbnail} />
                <p>{comment.author_name}</p>
                <p>{comment.content}</p>
              </div>
            );
          })}
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button onClick={sendComment}>send</button>
        </>
        <div>
          <ModalCloseButton
            onClick={() => {
              setWorkModalID("");
            }}
          >
            close
          </ModalCloseButton>
        </div>
      </ModalContent>
    </ModalCover>
  );
}
