import { Flex, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const EmptyHandle = ({ showText, buttonText, link }) => {
  const navigate = useNavigate();
  return (
    <Flex direction="column" justify="center" align="center">
      <Text my="40px">{showText}</Text>
      <Button colorScheme="purple" onClick={() => navigate(link)}>
        {buttonText}
      </Button>
    </Flex>
  );
};

EmptyHandle.propTypes = {
  showText: PropTypes.string,
  buttonText: PropTypes.string,
  link: PropTypes.string,
};
