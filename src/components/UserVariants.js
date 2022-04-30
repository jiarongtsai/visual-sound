import React from "react";
import { HStack, Stack, Avatar, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const UserWithTime = ({ id, name, thumbnail, time }) => {
  return (
    <Link to={`/user/${id}`}>
      <Stack pb={2} direction={"row"} spacing={4} align={"center"}>
        <Avatar src={thumbnail} alt={name} />
        <Stack direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{name}</Text>
          <Text color={"gray.500"}>{time}</Text>
        </Stack>
      </Stack>
    </Link>
  );
};

export const UserSmall = ({ id, name, thumbnail }) => {
  return (
    <Link to={`/user/${id}`}>
      <HStack spacing="2" display="flex" alignItems="center">
        <Image
          borderRadius="full"
          boxSize="30px"
          src={thumbnail}
          alt={`Avatar of ${name}`}
        />
        <Text fontWeight="400">{name}</Text>
      </HStack>
    </Link>
  );
};

export const MessageUserSmall = ({ name, thumbnail }) => {
  return (
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
  );
};
