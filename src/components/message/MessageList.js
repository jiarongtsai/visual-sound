import { onSnapshot } from "firebase/firestore";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
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

const MessageBox = ({ messageInfo, setCurrentChatroom, currentChatroom }) => {
  function handleClickBox() {
    setCurrentChatroom(messageInfo.mid);
    if (
      messageInfo.author_place === messageInfo.latestMessage.sender &&
      !messageInfo.latestMessage.has_read
    ) {
      Firebase.updateLatestMessage(messageInfo.mid, messageInfo.latestMessage);
    }
  }

  return (
    <div
      onClick={() => handleClickBox(messageInfo)}
      style={{ cursor: "pointer" }}
    >
      <PersonalInfoWrapper>
        <Thumbnail src={messageInfo.author_thumbnail} />
        <p>{messageInfo.author_name}</p>
        {messageInfo.author_place === messageInfo.latestMessage.sender &&
        !messageInfo.latestMessage.has_read &&
        currentChatroom !== messageInfo.mid ? (
          <Unread />
        ) : (
          ""
        )}
      </PersonalInfoWrapper>
      <p>{messageInfo.latestMessage.content}</p>
      <hr />
    </div>
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
        {messageList &&
          messageList.map((messageInfo) => {
            return (
              <Link key={messageInfo.mid} to={`/message/${messageInfo.mid}`}>
                <MessageBox
                  messageInfo={messageInfo}
                  setCurrentChatroom={setCurrentChatroom}
                  currentChatroom={currentChatroom}
                />
              </Link>
            );
          })}
      </MessageWrapper>
    </Wrapper>
  );
}
