import React, { useState, useContext } from "react";
import styled from "styled-components";
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

const MessageBox = ({ item, setCurrentChatroom }) => {
  return (
    <a onClick={() => setCurrentChatroom(item)} style={{ cursor: "pointer" }}>
      <PersonalInfoWrapper>
        <Thumbnail src={item.author_thumbnail} />
        <p>{item.author_name}</p>
      </PersonalInfoWrapper>
      <p>{item.latestMessage.content}</p>
      <p>{`${
        item.author_place === item.latestMessage.sender &&
        !item.latestMessage.has_read
          ? "unread"
          : "-----"
      }`}</p>
      <hr />
    </a>
  );
};

export default function MessageList({ messageList, setCurrentChatroom }) {
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
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={searchForUser}>search for user</button>
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
            />
          );
        })}
      </MessageWrapper>
    </Wrapper>
  );
}
