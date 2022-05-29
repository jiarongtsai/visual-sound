import { HStack, Text, Image, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

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

UserSmall.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
};
