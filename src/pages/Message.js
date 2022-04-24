import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../components/auth/Auth";
import MessageList from "../components/message/MessageList";
import MessageView from "../components/message/MessageView";

const MessageContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  text-align: left;
`;
export default function Message() {
  const user = useContext(AuthContext);
  return (
    <MessageContainer>
      <MessageList />
      <MessageView />
    </MessageContainer>
  );
}
