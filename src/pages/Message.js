import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
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
  const [messageList, setMessageList] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState({});
  const user = useContext(AuthContext);

  useEffect(() => {
    const onSnapshotChatrooms = Firebase.onSnapshotChatrooms(
      user.uid,
      async (snapshot) => {
        const senders = [];

        snapshot.docs.map((item) => {
          item.data().participants.forEach((id, i) => {
            if (id !== user.uid)
              senders.push({ id: id, place: i, mid: item.id });
          });
        });

        const result = await Promise.all(
          senders.map(async (sender) => {
            const latestMessage = await Firebase.getLatestMessage(sender.mid);
            const senderInfo = await Firebase.getUserBasicInfo(sender.id);

            return {
              mid: sender.mid,
              author_id: sender.id,
              author_place: sender.place,
              ...senderInfo,
              latestMessage,
            };
          })
        );
        setMessageList(result);
      }
    );
    console.log(Object.keys(currentChatroom).length === 0);
    // const onSnapshotLatestMessage = Firebase.onSnapshotLatestMessage()
    return () => {
      onSnapshotChatrooms();
    };
  }, []);

  return (
    <MessageContainer>
      <MessageList
        messageList={messageList}
        currentChatroom={currentChatroom}
        setCurrentChatroom={setCurrentChatroom}
      />
      <MessageView currentChatroom={currentChatroom} />
    </MessageContainer>
  );
}
