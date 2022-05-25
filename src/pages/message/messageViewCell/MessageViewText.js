import React from "react";
import PropTypes from "prop-types";
import { Text, useColorModeValue } from "@chakra-ui/react";

export const MessageViewText = ({ children }) => {
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

MessageViewText.propTypes = {
  children: PropTypes.string,
};
