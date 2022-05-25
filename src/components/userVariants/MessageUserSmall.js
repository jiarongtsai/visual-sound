import { HStack, Text, Image, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const MessageUserSmall = ({ name, thumbnail }) => {
  return (
    <HStack spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="30px"
        src={thumbnail}
        alt={`Avatar of ${name}`}
      />
      <Text color={useColorModeValue("gray.500", "gray.400")} fontWeight="400">
        {name}
      </Text>
    </HStack>
  );
};

MessageUserSmall.propTypes = {
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
