import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";
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
} from "@chakra-ui/react";
import { BsCursorFill, BsPlusSquare } from "react-icons/bs";
import { MessageViewReceiver, MessageViewSender } from "./MessageViewCell";
import { UserWithName } from "../UserVariants";

export default function MessageView({ currentChatroom, openNewChatList }) {
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
      <Box boxShadow="base" p={4}>
        <UserWithName
          id={currentChatInfo.author_id}
          name={currentChatInfo.author_name}
          thumbnail={currentChatInfo.author_thumbnail}
        />
      </Box>

      <VStack
        align="center"
        h={"58vh"}
        overflowY={"scroll"}
        borderTop="1px"
        borderColor={borderColor}
        pt={3}
      >
        {/* time calculate  MessageView cell */}
        {chats.map((chat, i) => (
          <>
            <Text color="gray.500" fontSize="sm">
              {chat.created_time.toDate().toString().slice(4, 21)}
            </Text>
            {chat.sender === currentChatInfo.author_place ? (
              <MessageViewSender
                content={chat.content}
                name={`${currentChatInfo.author_name}`}
                thumbnail={`${currentChatInfo.author_thumbnail}`}
              />
            ) : (
              <MessageViewReceiver content={chat.content} />
            )}
          </>
        ))}
        <div ref={endRef}></div>
      </VStack>
      {/* simillar component as comment */}
      <Flex align="center" justify="center" p={4}>
        <InputGroup size="lg" position="relative">
          <Input
            rounded="full"
            placeholder="Typing....."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={sendMessageKeyDown}
          />
          <InputRightElement>
            <IconButton
              // bg="transparent"
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
      {/* <input  /> */}
      {/* <button onClick={sendMessage}>send</button>
      </div> */}
    </Flex>
  );
}
