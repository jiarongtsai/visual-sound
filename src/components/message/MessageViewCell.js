import React from "react";
import { HStack, Image, Text, Flex, useColorModeValue } from "@chakra-ui/react";

export const MessageViewCell = ({ name, thumbnail, content, time }) => {
  return (
    <Flex direction="column" py={2} px={6}>
      {/* <Text>{time}</Text> */}
      <HStack spacing="2" display="flex" alignItems="center">
        <Image
          borderRadius="full"
          boxSize="30px"
          src={thumbnail}
          alt={`Avatar of ${name}`}
        />
        <Text color="gray.500" fontWeight="400">
          {name}
        </Text>
      </HStack>
      <Text
        mt={2}
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
