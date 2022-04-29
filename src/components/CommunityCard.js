import {
  Box,
  Center,
  Flex,
  Spacer,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  BsHeart,
  BsHeartFill,
  BsChat,
  BsFillChatFill,
  BsBookmark,
  BsFillBookmarkFill,
} from "react-icons/bs";
import CollectWithCategory from "../pages/CollectWithCategory";

export default function CommunityCard({
  work,
  i,
  likes,
  handleLike,
  location,
}) {
  return (
    <Center my={4}>
      <Box
        maxW={"640px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        rounded={"md"}
        px={4}
        overflow={"hidden"}
        textAlign={"left"}
      >
        <Stack my={4} direction={"row"} spacing={4} align={"center"}>
          <Avatar src={work.author_thumbnail} alt={work.author_name} />
          <Stack direction={"column"} spacing={0} fontSize={"sm"}>
            <Text fontWeight={600}>{work.author_name}</Text>
            <Text color={"gray.500"}>
              {work.created_time.toDate().toDateString()}
            </Text>
          </Stack>
        </Stack>
        <Box bg={"gray.100"} pos={"relative"} mx={-4}>
          <Link
            to={`/work/${work.id}`}
            state={{ backgroundLocation: location }}
          >
            <Image
              h={[400, 550]}
              w={[400, 550]}
              src={work.image_url}
              objectFit="cover"
            />
          </Link>
        </Box>
        <Flex mx={-4}>
          {likes[i] ? (
            <IconButton
              pt={1}
              variant="ghost"
              aria-label="like"
              icon={<BsHeartFill />}
              onClick={() => handleLike(work.id, i, work.liked_by)}
            />
          ) : (
            <IconButton
              pt={1}
              variant="ghost"
              aria-label="like"
              icon={<BsHeart />}
              onClick={() => handleLike(work.id, i, work.liked_by)}
            />
          )}

          <IconButton
            mr="auto"
            variant="ghost"
            aria-label="comment"
            icon={<BsChat />}
          />
          <Spacer />
          <CollectWithCategory id={work.id} collectedList={work.collected_by} />
        </Flex>
        <Stack mb={3} direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{work.author_name}</Text>
          <Text color={"gray.500"}>{work.description}</Text>
          {/* <Text fontWeight={600}>...More</Text> */}
        </Stack>
        <Stack mb={6} spacing={1}>
          {work.latestComments?.map((comment) => {
            return (
              <Box key={comment.id} fontSize={"sm"}>
                <Text as={"a"} mr={2} fontWeight={600}>
                  {comment.author_name}
                </Text>
                <Text as={"span"} color={"gray.500"}>
                  {comment.content}
                </Text>
              </Box>
            );
          })}
          <Link
            to={`/work/${work.id}`}
            state={{ backgroundLocation: location }}
          >
            {work.comments_count ? (
              <Text fontWeight={600} fontSize={"sm"}>
                {`view all ${work.comments_count} comments`}
              </Text>
            ) : (
              ""
            )}
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}
