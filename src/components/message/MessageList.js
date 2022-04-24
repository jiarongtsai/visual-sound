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

const MessageBox = () => {
  return (
    <div>
      <PersonalInfoWrapper>
        <Thumbnail src="https://joeschmoe.io/api/v1/random" />
        <p>Bella</p>
      </PersonalInfoWrapper>
      <p>latest message</p>
      <p>unread</p>
    </div>
  );
};

export default function MessageList() {
  return (
    <Wrapper>
      <div>
        <div>User Name</div>
        <span>chat with ++</span>
        {/* open a modal, searching for user */}
      </div>
      <br />
      <MessageWrapper>
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
        <MessageBox />
      </MessageWrapper>
    </Wrapper>
  );
}
