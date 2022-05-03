import { Flex, Text, Image } from "@chakra-ui/react";

function CollectionWrapper({ collectionName, imageUrl, setCurrentTerm }) {
  return (
    <Flex
      flexShrink="0"
      w={["80px", "100px"]}
      m={6}
      direction="column"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={() => setCurrentTerm(collectionName)}
    >
      <Image
        p={1}
        w="100px"
        h="100px"
        objectFit="cover"
        src={imageUrl}
        alt={`Picture of ${collectionName}`}
        rounded="full"
        border="2px"
        borderColor="transparent"
        _hover={{
          border: "2px",
          borderColor: "purple.500",
        }}
      />
      <Text fontWeight="600" my="2">
        {collectionName}
      </Text>
    </Flex>
  );
}

export default CollectionWrapper;
