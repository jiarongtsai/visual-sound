import { Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MessageViewText } from "./MessageViewText";

export const MessageViewReceiver = ({ content }) => {
  return (
    <Flex alignSelf="flex-end" px={6}>
      <MessageViewText>{content}</MessageViewText>
    </Flex>
  );
};

MessageViewReceiver.propTypes = {
  content: PropTypes.string,
};
