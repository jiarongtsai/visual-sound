import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";
import { Thumbnail } from "../element/Thumbnail";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
`;

const PersonalInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MessageWrapper = styled.div`
  overflow: scroll;
  height: 60vh;
`;

const MessageBox = ({ name, thumbnail, content, time }) => {
  return (
    <div
      style={{
        background: "gray",
        color: "white",
        borderRadius: "1rem",
        margin: "2rem",
      }}
    >
      <PersonalInfoWrapper>
        <Thumbnail src={thumbnail} />
        <p>{name}</p>
      </PersonalInfoWrapper>
      <div>{content}</div>
      <p>{time}</p>
      <br />
    </div>
  );
};

export default function MessageView({ currentChatroom }) {
  const { mid } = useParams();
  const user = useContext(AuthContext);
  const location = useLocation;
  const [chats, setChats] = useState([]);
  const [currentChatInfo, SetCurrentCahtInfo] = useState({});
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    const onSnapshotChat = Firebase.onSnapshotChats(mid, (snapshot) => {
      const allChats = snapshot.docs.map((item) => item.data());
      setChats(allChats);
    });

    mid &&
      Firebase.getChatroomInfo(mid, user?.uid).then((data) => {
        SetCurrentCahtInfo(data);
      });

    return () => {
      onSnapshotChat();
    };
  }, [mid]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  function sendMessage() {
    if (!currentChatroom) return;
    Firebase.addMessage(1 - currentChatInfo.author_place, mid, input).then(
      () => {
        setInput("");
      }
    );
  }

  if (!mid) return <div>Open new chat or Click user</div>;
  return (
    <Wrapper>
      <Link
        style={{ cursor: "pointer" }}
        to={`/user/${currentChatInfo.author_id}`}
        state={{ backgroundLocation: location }}
      >
        <PersonalInfoWrapper>
          <Thumbnail src={currentChatInfo.author_thumbnail} />
          <p>{currentChatInfo.author_name}</p>
        </PersonalInfoWrapper>
      </Link>
      <MessageWrapper>
        {chats.map((chat, i) => (
          <MessageBox
            key={i}
            content={chat.content}
            time={chat.created_time.toDate().toString().slice(0, 25)}
            name={`${
              chat.sender === currentChatInfo.author_place
                ? currentChatInfo.author_name
                : user.displayName
            }`}
            thumbnail={`${
              chat.sender === currentChatInfo.author_place
                ? currentChatInfo.author_thumbnail
                : user.photoURL
            }`}
          />
        ))}
        <div ref={endRef}></div>
      </MessageWrapper>
      <br />
      <div>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>send</button>
      </div>
    </Wrapper>
  );
}
