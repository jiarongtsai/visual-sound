import React, { useContext } from "react";
import { AuthContext } from "../components/auth/Auth";
import MessageList from "../components/message/MessageList";
import MessageView from "../components/message/MessageView";
export default function Message() {
  const user = useContext(AuthContext);
  return (
    <>
      <MessageList />
      <MessageView />
    </>
  );
}
