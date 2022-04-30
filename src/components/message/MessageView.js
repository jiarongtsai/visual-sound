import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
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
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { BsCursorFill } from "react-icons/bs";
import { MessageViewCell } from "./MessageViewCell";

export default function MessageView({ currentChatroom }) {
  const { mid } = useParams();
  const user = useContext(AuthContext);
  const location = useLocation;
  const [chats, setChats] = useState([]);
  const [currentChatInfo, SetCurrentCahtInfo] = useState({});
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const textColor = useColorModeValue("gray.700", "white");
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
        {/* <IconButton aria-label="like" icon={<BsChat />} /> */}
        <Text>Open new chat or Click a chatroom</Text>
        {/* fix me : add new chat button */}
      </Center>
    );
  return (
    <Flex direction="column">
      <Link
        style={{ cursor: "pointer" }}
        to={`/user/${currentChatInfo.author_id}`}
        state={{ backgroundLocation: location }}
      >
        <Box boxShadow="base" p={4}>
          <Flex align="center">
            <Button
              w="50px"
              h="50px"
              rounded={"full"}
              variant="ghost"
              me="10px"
            >
              <Avatar
                src={currentChatInfo.author_thumbnail}
                alt={currentChatInfo.author_name}
              />
            </Button>
            <Text fontSize="sm" color={textColor} fontWeight="bold">
              {currentChatInfo.author_name}
            </Text>
          </Flex>
        </Box>
      </Link>
      <VStack
        align="flex-start"
        h={"58vh"}
        overflowY={"scroll"}
        borderTop="1px"
        borderColor={borderColor}
      >
        {/* time, align for  MessageView cell */}
        {chats.map((chat, i) => (
          <MessageViewCell
            key={i}
            content={chat.content}
            time={chat.created_time.toDate().toString().slice(4, 25)}
            name={`${
              chat.sender === currentChatInfo.author_place
                ? currentChatInfo.author_name
                : user.displayName
            }`}
            thumbnail={`${
              chat.sender === currentChatInfo.author_place
                ? currentChatInfo.author_thumbnail
                : user.photoURL
            }`}
          />
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
