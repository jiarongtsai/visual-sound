import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Box, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import { AuthContext } from "../../components/auth/Auth";
import MessageList from "./MessageList";
import MessageView from "./MessageView";
import UsersModal from "../../components/UsersModal";
import Loader from "../../components/Loader";

export default function Message() {
  const [messageList, setMessageList] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState({});
  const [user, loading, error] = useContext(AuthContext);
  const { mid } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.500");

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
      (chatroomData) => {
        setMessageList(chatroomData);
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
    const excludeChatList = messageList.map((message) => message.author_id);
    excludeChatList.push(user.uid);
    const newChatList = await Firebase.getAllUsers(excludeChatList);

    setAction({
      name: "Send Message to...",
      userList: newChatList,
      invokeFunction: openNewChat,
      buttonText: "Message",
    });
    onOpen();
  }

  if (loading) return <Loader />;

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />

      <Flex
        mt={12}
        mx="auto"
        w="90%"
        h="100%"
        rounded="md"
        maxW="1080px"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <Box
          w={["20%", 160, "30%"]}
          minW="80px"
          maxW="300px"
          borderRight="1px"
          borderColor={borderColor}
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
