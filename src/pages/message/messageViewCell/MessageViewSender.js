import { Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { MessageUserSmall } from "../../../components/userVariants/MessageUserSmall";
import { MessageViewText } from "./MessageViewText";

export const MessageViewSender = ({ name, thumbnail, content }) => {
  return (
    <Flex direction="column" alignSelf="flex-start" px={6}>
      <MessageUserSmall name={name} thumbnail={thumbnail} />
      <MessageViewText>{content}</MessageViewText>
    </Flex>
  );
};

MessageViewSender.propTypes = {
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  content: PropTypes.string,
};
