import React from "react";
import PropTypes from "prop-types";
import { Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { MessageUserSmall } from "../../components/UserVariants";

const MessageText = ({ children }) => {
  return (
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
      {children}
    </Text>
  );
};

export const MessageViewSender = ({ name, thumbnail, content }) => {
  return (
    <Flex direction="column" alignSelf="flex-start" px={6}>
      <MessageUserSmall name={name} thumbnail={thumbnail} />
      <MessageText>{content}</MessageText>
    </Flex>
  );
};

export const MessageViewReceiver = ({ content }) => {
  return (
    <Flex alignSelf="flex-end" px={6}>
      <MessageText>{content}</MessageText>
    </Flex>
  );
};

MessageViewSender.propTypes = {
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  content: PropTypes.string,
};

MessageViewReceiver.propTypes = {
  content: PropTypes.string,
};
