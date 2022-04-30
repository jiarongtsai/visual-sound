import {
  HStack,
  Stack,
  Avatar,
  Text,
  Image,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const UserWithName = ({ id, name, thumbnail }) => {
  const textColor = useColorModeValue("gray.700", "white");
  return (
    <Link to={`/user/${id}`}>
      <Flex align="center">
        <Avatar
          src={thumbnail}
          alt={name}
          w="50px"
          h="50px"
          rounded={"full"}
          me="10px"
        />
        <Text
          fontSize="sm"
          color={textColor}
          fontWeight="bold"
          display={["none", "initial"]}
        >
          {name}
        </Text>
      </Flex>
    </Link>
  );
};

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
