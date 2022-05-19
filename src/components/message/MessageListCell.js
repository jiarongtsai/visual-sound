import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Flex,
  Text,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import { Notification } from "./Notification";

export default function MessageBox({
  messageInfo,
  setCurrentChatroom,
  currentChatroom,
}) {
  function handleClickBox() {
    setCurrentChatroom(messageInfo.mid);
    if (
      messageInfo.author_place === messageInfo.latestMessage.sender &&
      !messageInfo.latestMessage.has_read
    ) {
      Firebase.updateLatestMessage(messageInfo.mid, messageInfo.latestMessage);
    }
  }
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Flex
      justifyContent="space-between"
      w="92%"
      mx="auto"
      maxW="290px"
      px={2}
      py={2}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.800"),
      }}
      _first={{
        marginTop: "2",
      }}
    >
      <Link
        style={{ display: "inlineBlock", width: "100%" }}
        to={`/message/${messageInfo.mid}`}
        onClick={() => handleClickBox(messageInfo)}
      >
        <Flex
          align="center"
          justify="space-between"
          w="100%"
          position="relative"
        >
          <Avatar
            src={messageInfo.author_thumbnail}
            alt={messageInfo.author_name}
            w="50px"
            h="50px"
            rounded={"full"}
            me="10px"
          />
          <Flex direction="column">
            <Text
              fontSize="sm"
              color={textColor}
              fontWeight="bold"
              display={["none", "initial"]}
            >
              {messageInfo.author_name}
            </Text>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.500", "gray.400")}
              fontWeight="400"
              overflow="hidden"
              textOverflow="ellipsis"
              textAlign="left"
              h={6}
              display={["none", "none", "initial"]}
            >
              {messageInfo.latestMessage.content}
            </Text>
          </Flex>
          <Spacer />

          {messageInfo.author_place === messageInfo.latestMessage.sender &&
          !messageInfo.latestMessage.has_read &&
          currentChatroom !== messageInfo.mid ? (
            <Notification right="0px" top="17.5px" activeColor="purple.500" />
          ) : (
            ""
          )}
        </Flex>
      </Link>
    </Flex>
  );
}
