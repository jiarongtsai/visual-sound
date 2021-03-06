import PropTypes from "prop-types";
import { Flex, Text, Image, Button } from "@chakra-ui/react";

function CollectionWrapper({
  collectionName,
  imageUrl,
  currentTerm,
  setCurrentTerm,
}) {
  return (
    <Flex
      flexShrink="0"
      m={[4, 4, 6]}
      mb={[8, 8, 10]}
      direction="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={() => setCurrentTerm(collectionName)}
    >
      <Button
        p={1}
        w={["70px", "70px", "100px"]}
        h={["70px", "70px", "100px"]}
        variant="unstyled"
        border="2px"
        rounded="full"
        borderColor="transparent"
        _hover={{
          borderColor: "purple.500",
          opacity: 0.8,
        }}
        _active={{
          borderColor: "purple.500",
        }}
        isActive={currentTerm === collectionName}
      >
        <Image
          w={["58px", "58px", "88px"]}
          h={["58px", "58px", "88px"]}
          objectFit="cover"
          rounded="full"
          src={imageUrl}
          alt={`Picture of ${collectionName}`}
        />
      </Button>
      {currentTerm === collectionName ? (
        <Text fontWeight="600" my="2" color="purple.500">
          {collectionName}
        </Text>
      ) : (
        <Text fontWeight="600" my="2">
          {collectionName}
        </Text>
      )}
    </Flex>
  );
}

export default CollectionWrapper;

CollectionWrapper.propTypes = {
  collectionName: PropTypes.string,
  imageUrl: PropTypes.string,
  currentTerm: PropTypes.string,
  setCurrentTerm: PropTypes.func,
};
