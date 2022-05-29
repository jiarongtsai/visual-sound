import { Avatar, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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
        <Text fontSize="sm" color={textColor} fontWeight="bold">
          {name}
        </Text>
      </Flex>
    </Link>
  );
};

UserWithName.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
