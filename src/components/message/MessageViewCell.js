import React from "react";
import { Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { MessageUserSmall } from "../UserVariants";

export const MessageViewSender = ({ name, thumbnail, content }) => {
  return (
    <Flex direction="column" alignSelf="flex-start" px={6}>
      <MessageUserSmall name={name} thumbnail={thumbnail} />
      <Text
        mt={1}
        ml={8}
        rounded="2xl"
        minH="30px"
        maxW="400px"
        bg={useColorModeValue("gray.300", "gray.900")}
        py={2}
        px={3}
      >
        {content}
      </Text>
    </Flex>
  );
};

export const MessageViewReceiver = ({ content, time }) => {
  return (
    <Flex alignSelf="flex-end" px={6}>
      <Text
        mt={1}
        ml={8}
        rounded="2xl"
        minH="30px"
        maxW="400px"
        bg={useColorModeValue("gray.300", "gray.900")}
        py={2}
        px={3}
      >
        {content}
      </Text>
    </Flex>
  );
};
