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
import moment from "moment";
import PropTypes from "prop-types";

function getReadableTime(timestamp) {
  const cur = Math.floor(Date.now() / 1000);
  const base = (cur - timestamp) / 86400;
  if (base < 1) {
    return moment.unix(timestamp).fromNow();
  }
  return moment.unix(timestamp).calendar();
}

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

export const UserWithTime = ({ id, name, thumbnail, timestamp }) => {
  return (
    <Link to={`/user/${id}`}>
      <Stack pb={2} direction={"row"} spacing={4} align={"center"}>
        <Avatar src={thumbnail} alt={name} />
        <Stack direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{name}</Text>
          <Text color={useColorModeValue("gray.500", "gray.400")}>
            {getReadableTime(timestamp)}
          </Text>
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
      <Text color={useColorModeValue("gray.500", "gray.400")} fontWeight="400">
        {name}
      </Text>
    </HStack>
  );
};

UserWithName.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
UserWithTime.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  timestamp: PropTypes.number,
};
UserSmall.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
MessageUserSmall.propTypes = {
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
