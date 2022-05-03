import {
  Flex,
  Text,
  Circle,
  Box,
  Image,
  Badge,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
} from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { Square } from "./visual/VisualElement";

const data = {
  isNew: true,
  imageURL:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80",
  name: "Wayfarer Classic",
  price: 4.5,
  rating: 4.2,
  numReviews: 34,
};

//fix me

// collection card 可以橫向滑動，然後點了就更換gallery的資料！
// data {title, count, imageList{src, alt}}
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
