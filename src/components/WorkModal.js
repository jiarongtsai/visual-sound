import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import { AuthContext } from "../components/auth/Auth";
import { ModalBackground } from "./element/ModalBackground";
import { ModalContent } from "./element/ModalContent";
import CollectWithCategory from "../pages/CollectWithCategory";

const ModalContentVisual = styled.div`
  flex-basis: 60%;
  overflow: scroll;
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

export default function WorkModal() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const buttonRef = useRef(null);

  function onDismiss() {
    navigate(-1);
  }

  const [work, setWork] = useState({});
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    Firebase.getWork(id).then((data) => {
      setLike(data.liked_by.includes(user.uid));
      setWork(data);
    });
  }, []);

  useEffect(() => {
    const onSnapshotComments = Firebase.onSnapshotComments(
      id,
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
    const count = comments.length + 1 || 1;
    Firebase.addComment(user.uid, id, input, count).then(() => {
      setInput("");
    });
  }

  function handleLike(id, list) {
    if (!like) {
      Firebase.likeWork(user.uid, id, list).then(() => {
        setLike(!like);
      });
      return;
    }

    Firebase.unlikeWork(user.uid, id, list).then(() => {
      setLike(!like);
    });
  }

  if (!work) return null;
  return (
    <ModalBackground>
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
                    themeColor={work.themeColor}
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
            <CollectWithCategory
              id={work.id}
              collectedList={work.collected_by}
            />
          </div>
          <br />
          <br />
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
        <ModalCloseButton ref={buttonRef} onClick={onDismiss}>
          X
        </ModalCloseButton>
      </ModalContent>
    </ModalBackground>
  );
}
