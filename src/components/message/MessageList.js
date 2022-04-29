import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../auth/Auth";
import ShowAllUsersModal from "../ShowAllUsersModal";
import MessageListCell from "./MessageListCell";
import {
  Box,
  Avatar,
  Button,
  Flex,
  Text,
  useColorModeValue,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { BsPlusSquare } from "react-icons/bs";

//remove me later
export const PersonalInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default function MessageList({
  messageList,
  setCurrentChatroom,
  currentChatroom,
}) {
  const user = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const textColor = useColorModeValue("gray.700", "white");

  function searchForUser() {
    setShowModal(true);
  }

  return (
    <Flex direction="column">
      {showModal && (
        <ShowAllUsersModal
          setShowModal={setShowModal}
          messageList={messageList}
        />
      )}
      <Box
        display={["none", "initial"]}
        borderButtom="1px"
        borderColor={useColorModeValue("gray.200", "gray.500")}
        boxShadow="base"
        p={4}
        pb={0}
      >
        <Flex align="center">
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            w="50px"
            h="50px"
            rounded={"full"}
            me="10px"
          />
          <Text fontSize="sm" color={textColor} fontWeight="bold">
            {user.displayName}
          </Text>
        </Flex>
        <Button
          my={3}
          onClick={searchForUser}
          colorScheme="purple"
          variant="solid"
          leftIcon={<BsPlusSquare />}
        >
          New chat
        </Button>
      </Box>

      <VStack
        alignItems={"flex-start"}
        h={["78vh", "60vh"]}
        overflowY={"scroll"}
        divider={
          <StackDivider
            borderColor={useColorModeValue("gray.200", "gray.500")}
          />
        }
      >
        {messageList &&
          messageList.map((messageInfo) => {
            return (
              <MessageListCell
                key={messageInfo.mid}
                messageInfo={messageInfo}
                setCurrentChatroom={setCurrentChatroom}
                currentChatroom={currentChatroom}
              />
            );
          })}
      </VStack>
    </Flex>
  );
}
