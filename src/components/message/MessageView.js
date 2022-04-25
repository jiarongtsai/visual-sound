import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
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
  const user = useContext(AuthContext);
  const location = useLocation;
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    Firebase.onSnapshotChats(currentChatroom.mid, (snapshot) => {
      const allChats = snapshot.docs.map((item) => item.data());
      setChats(allChats);
    });
  }, [currentChatroom]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  function sendMessage() {
    if (Object.keys(currentChatroom).length === 0) return;
    Firebase.addMessage(
      1 - currentChatroom.author_place,
      currentChatroom.mid,
      input
    ).then(() => {
      setInput("");
    });
  }

  if (Object.keys(currentChatroom).length === 0)
    return <div>Open new chat or Click user</div>;
  return (
    <Wrapper>
      <Link
        style={{ cursor: "pointer" }}
        to={`/user/${currentChatroom.author_id}`}
        state={{ backgroundLocation: location }}
      >
        <PersonalInfoWrapper>
          <Thumbnail src={currentChatroom.author_thumbnail} />
          <p>{currentChatroom.author_name}</p>
        </PersonalInfoWrapper>
      </Link>
      <MessageWrapper>
        {chats.map((chat, i) => (
          <MessageBox
            key={i}
            content={chat.content}
            time={chat.created_time.toDate().toString().slice(0, 25)}
            name={`${
              chat.sender === currentChatroom.author_place
                ? currentChatroom.author_name
                : user.displayName
            }`}
            thumbnail={`${
              chat.sender === currentChatroom.author_place
                ? currentChatroom.author_thumbnail
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
