import React from "react";
import styled from "styled-components";
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

const MessageBox = () => {
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
        <Thumbnail src="https://joeschmoe.io/api/v1/random" />
        <p>Bella</p>
      </PersonalInfoWrapper>
      <div>cool, I am building a chat app</div>
      <p>2022/04/24 8:59:00</p>
      <br />
    </div>
  );
};

export default function MessageView() {
  return (
    <Wrapper>
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
        <MessageBox />
        <MessageBox />
        <MessageBox />
      </MessageWrapper>
      <br />
      <div>
        <input />
        <button>send</button>
      </div>
    </Wrapper>
  );
}
