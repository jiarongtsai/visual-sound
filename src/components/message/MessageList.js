import React, { useContext } from "react";
import { AuthContext } from "../auth/Auth";
import MessageListCell from "./MessageListCell";

import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { BsPlusSquare } from "react-icons/bs";
import { UserWithName } from "../UserVariants";

export default function MessageList({
  messageList,
  openNewChatList,
  setCurrentChatroom,
  currentChatroom,
}) {
  const user = useContext(AuthContext);

  return (
    <>
      <Flex direction="column">
        <Box
          display={["none", "initial"]}
          // borderButtom="1px"
          // borderColor={useColorModeValue("gray.200", "gray.500")}
          boxShadow="base"
          p={4}
          pb={0}
        >
          <UserWithName
            id={user.uid}
            name={user.displayName}
            thumbnail={user.photoURL}
          />

          <Button
            my={3}
            onClick={openNewChatList}
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
    </>
  );
}
