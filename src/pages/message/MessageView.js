import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getReadableTime, getDetailTime } from "../../utils/helper";
import {
  VStack,
  Text,
  Box,
  Flex,
  Center,
  IconButton,
  useColorModeValue,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { BsCursorFill, BsPlusSquare } from "react-icons/bs";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { AuthContext } from "../../components/auth/Auth";
import { Firebase } from "../../utils/firebase";
import { UserWithName } from "../../components/userVariants/UserWithName";
import { MessageViewReceiver } from "./messageViewCell/MessageViewReceiver";
import { MessageViewSender } from "./messageViewCell/MessageViewSender";
import Loader from "../../components/Loader";

export default function MessageView({
  currentChatroom,
  setCurrentChatroom,
  openNewChatList,
}) {
  const { mid } = useParams();
  const [user, loading, error] = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [currentChatInfo, SetCurrentCahtInfo] = useState({});
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const borderColor = useColorModeValue("gray.200", "gray.500");

  useEffect(() => {
    const onSnapshotChat = Firebase.onSnapshotChats(mid, (snapshot) => {
      const allChats = snapshot.docs.map((item) => item.data());
      setChats(allChats);
    });

    mid &&
      Firebase.getChatroomInfo(mid, user?.uid).then((data) => {
        SetCurrentCahtInfo(data);
      });

    return () => {
      onSnapshotChat();
    };
  }, [mid]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats]);

  function sendMessage() {
    if (!currentChatroom) return;
    if (!input.trim()) return;
    Firebase.addMessage(1 - currentChatInfo.author_place, mid, input).then(
      () => {
        setInput("");
      }
    );
  }

  function sendMessageKeyDown(e) {
    if (e.key !== "Enter") return;
    sendMessage();
  }

  if (loading) return <Loader />;

  if (!mid)
    return (
      <Center h="75vh" flexDirection="column">
        <Text>Open new chat or Click a chatroom</Text>
        <Button
          my={3}
          onClick={openNewChatList}
          colorScheme="purple"
          variant="solid"
          leftIcon={<BsPlusSquare />}
        >
          New chat
        </Button>
      </Center>
    );
  return (
    <Flex direction="column">
      <Box boxShadow="base" p={4} d="flex" alignItems="center">
        <IconButton
          icon={<MdOutlineArrowBackIosNew />}
          mr={4}
          display={{ base: "inline-flex", md: "none" }}
          onClick={() => setCurrentChatroom("")}
        />
        <UserWithName
          id={currentChatInfo.author_id}
          name={currentChatInfo.author_name}
          thumbnail={currentChatInfo.author_thumbnail}
        />
      </Box>
      <VStack
        align="center"
        h={"62vh"}
        overflowY={"scroll"}
        borderTop="1px"
        borderColor={borderColor}
        pt={3}
      >
        {chats.map((chat, i) => {
          return (
            <Flex key={i} direction="column" w="100%" alignItems="center">
              <Tooltip label={getDetailTime(chat.created_time.seconds)}>
                <Text color="gray.500" fontSize="sm" cursor="default">
                  {getReadableTime(chat.created_time.seconds)}
                </Text>
              </Tooltip>
              {chat.sender === currentChatInfo.author_place ? (
                <MessageViewSender
                  content={chat.content}
                  name={`${currentChatInfo.author_name}`}
                  thumbnail={`${currentChatInfo.author_thumbnail}`}
                />
              ) : (
                <MessageViewReceiver content={chat.content} />
              )}
            </Flex>
          );
        })}
        <div ref={endRef}></div>
      </VStack>
      <Flex align="center" justify="center" p={4}>
        <InputGroup size="md" position="relative">
          <Input
            rounded="full"
            placeholder="Typing....."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={sendMessageKeyDown}
          />
          <InputRightElement>
            <IconButton
              variant="ghost"
              rounded="full"
              position="absolute"
              right={2}
              aria-label="Search database"
              icon={<BsCursorFill />}
              onClick={sendMessage}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
}

MessageView.propTypes = {
  currentChatroom: PropTypes.string,
  setCurrentChatroom: PropTypes.func,
  openNewChatList: PropTypes.func,
};
