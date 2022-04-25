import { onSnapshot } from "firebase/firestore";
import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../../utils/firebase";
import { AuthContext } from "../auth/Auth";
import { Thumbnail } from "../element/Thumbnail";
import ShowAllUsersModal from "../ShowAllUsersModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
`;

export const PersonalInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MessageWrapper = styled.div`
  overflow: scroll;
  height: 60vh;
`;

const Unread = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  display: inline-block;
  margin-left: auto;
  margin-right: 20px;
`;

const MessageBox = ({ item, setCurrentChatroom, currentChatroom }) => {
  function handleClickBox() {
    setCurrentChatroom(item);
    if (
      item.author_place === item.latestMessage.sender &&
      !item.latestMessage.has_read
    ) {
      Firebase.updateLatestMessage(item.mid, item.latestMessage);
    }
  }

  return (
    <a onClick={() => handleClickBox(item)} style={{ cursor: "pointer" }}>
      <PersonalInfoWrapper>
        <Thumbnail src={item.author_thumbnail} />
        <p>{item.author_name}</p>
        {item.author_place === item.latestMessage.sender &&
        !item.latestMessage.has_read &&
        currentChatroom.mid !== item.mid ? (
          <Unread />
        ) : (
          ""
        )}
      </PersonalInfoWrapper>
      <p>{item.latestMessage.content}</p>
      <hr />
    </a>
  );
};

export default function MessageList({
  messageList,
  setCurrentChatroom,
  currentChatroom,
}) {
  const user = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  function searchForUser() {
    setShowModal(true);
  }

  return (
    <Wrapper>
      {showModal && (
        <ShowAllUsersModal
          setShowModal={setShowModal}
          messageList={messageList}
        />
      )}
      <div>
        <PersonalInfoWrapper>
          <Thumbnail src={user.photoURL} />
          <div>{user.displayName || "have't set name"}</div>
        </PersonalInfoWrapper>
        <div>
          {/* <input value={input} onChange={(e) => setInput(e.target.value)} /> */}
          <button onClick={searchForUser}>open new chat</button>
        </div>
      </div>
      <br />
      <MessageWrapper>
        {messageList.map((item) => {
          return (
            <MessageBox
              key={item.mid}
              item={item}
              setCurrentChatroom={setCurrentChatroom}
              currentChatroom={currentChatroom}
            />
          );
        })}
      </MessageWrapper>
    </Wrapper>
  );
}
