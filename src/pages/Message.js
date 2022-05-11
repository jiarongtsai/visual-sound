import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import MessageList from "../components/message/MessageList";
import MessageView from "../components/message/MessageView";
import UsersModal from "../components/UsersModal";

export default function Message() {
  const [messageList, setMessageList] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState({});
  const user = useContext(AuthContext);
  const { mid } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    mid &&
      Firebase.checkChatroomParticipants(mid, user.uid).then((result) => {
        if (result) {
          setCurrentChatroom(mid);
          return;
        }
        navigate(`/message`);
      });

    const onSnapshotChatrooms = Firebase.onSnapshotChatrooms(
      user.uid,
      async (snapshot) => {
        const senders = [];

        snapshot.docs.map((item) => {
          item.data().participants.forEach((id, i) => {
            if (id !== user.uid)
              senders.push({
                id: id,
                place: i,
                mid: item.id,
                latestMessage: item.data().latestMessage,
              });
          });
        });

        const result = await Promise.all(
          senders.map(async (sender) => {
            const senderInfo = await Firebase.getUserBasicInfo(sender.id);

            return {
              mid: sender.mid,
              author_id: sender.id,
              author_place: sender.place,
              latestMessage: sender.latestMessage,
              ...senderInfo,
            };
          })
        );
        const ResultSortedByTime = result.sort((a, b) => {
          return (
            b.latestMessage.created_time.seconds -
            a.latestMessage.created_time.seconds
          );
        });
        setMessageList(ResultSortedByTime);
      }
    );

    return () => {
      onSnapshotChatrooms();
    };
  }, []);

  const openNewChat = async (userID) => {
    const mid = await Firebase.addNewChatroom(user.uid, userID);
    navigate(`/message/${mid}`);
    onClose();
  };

  async function openNewChatList() {
    const currentChatList = messageList.map((message) => message.author_id);
    currentChatList.push(user.uid);
    const newChatList = await Firebase.getAllUsers(currentChatList);

    setAction({
      name: "Send Message to...",
      userList: newChatList,
      invokeFunction: openNewChat,
      buttonText: "Message",
    });
    onOpen();
  }

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />

      <Flex
        mt={24}
        mx="auto"
        w="90%"
        h="100%"
        rounded="md"
        maxW="1080px"
        border="1px"
        borderColor={useColorModeValue("gray.200", "gray.500")}
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <Box
          w={["20%", 160, "30%"]}
          minW="80px"
          maxW="300px"
          borderRight="1px"
          borderColor={useColorModeValue("gray.200", "gray.500")}
        >
          <MessageList
            messageList={messageList}
            currentChatroom={currentChatroom}
            setCurrentChatroom={setCurrentChatroom}
            openNewChatList={openNewChatList}
          />
        </Box>
        <Box flex="1" h="100%">
          <MessageView
            currentChatroom={currentChatroom}
            openNewChatList={openNewChatList}
          />
        </Box>
      </Flex>
    </>
  );
}
