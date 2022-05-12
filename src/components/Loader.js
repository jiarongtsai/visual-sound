import { Spinner, Flex } from "@chakra-ui/react";

export default function () {
  return (
    <Flex h="100vh" justify="center" align="center">
      <Spinner size="xl" color="purple.500" />
    </Flex>
  );
}
