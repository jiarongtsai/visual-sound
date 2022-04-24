import React from "react";
import styled from "styled-components";
import { Thumbnail } from "../element/Thumbnail";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
`;

const PersonalInfoWrapper = styled.div`
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
      <p>latest message</p>
      <p>unread</p>
      <hr />
    </a>
  );
};

export default function MessageList({ messageList, setCurrentChatroom }) {
  return (
    <Wrapper>
      <div>
        <div>User Name</div>
        <button>chat with new person ++</button>
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
