import { Stack, Avatar, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getReadableTime } from "../../utils/helper";
import PropTypes from "prop-types";

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

UserWithTime.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  thumbnail: PropTypes.string,
  timestamp: PropTypes.number,
};
