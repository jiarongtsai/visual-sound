import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "./PlayerProvider";
import SequencePlayer from "./SequencePlayer";
console.clear();

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
  z-index: 990;
  background-color: white;
  width: 70vw;
  height: 70vh;
`;

const ModalText = styled.p`
  z-index: 999;
  margin-top: 5vh;
`;

const ModalCloseButton = styled.button`
  z-index: 999;
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

export default function WorkModal({ workModalID, setWorkModalID }) {
  const [work, setWork] = useState({});
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    Firebase.getWork(workModalID).then((data) => setWork(data));

    return () => {};
  }, []);

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
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button>send</button>
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
