import {
  Box,
  Center,
  Flex,
  Spacer,
  Text,
  Stack,
  useColorModeValue,
  IconButton,
  Image,
  Collapse,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill, BsChat, BsFillChatFill } from "react-icons/bs";
import CollectWithCategory from "../pages/CollectWithCategory";
import { useState, useEffect } from "react";
import { UserWithTime } from "./UserVariants";

export default function CommunityCard({
  work,
  i,
  likes,
  handleLike,
  location,
  collections,
  setCollections,
  follwingWorks,
}) {
  const [workIndex, setWorkIndex] = useState(-1);
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  useEffect(() => {
    const index = follwingWorks
      .map((singleWork) => singleWork.id.includes(work.id))
      .findIndex((include) => include);

    setWorkIndex(index);
  }, []);

  return (
    <Center my={4}>
      <Box
        maxW={"640px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        rounded={"md"}
        p={4}
        pb={6}
        overflow={"hidden"}
        textAlign={"left"}
      >
        <UserWithTime
          id={work.author_id}
          name={work.author_name}
          thumbnail={work.author_thumbnail}
          time={work.created_time.toDate().toDateString()}
        />

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
          <CollectWithCategory
            id={work.id}
            workIndex={workIndex}
            collectedList={work.collected_by}
            collections={collections}
            setCollections={setCollections}
          />
        </Flex>
        <Stack mb={3} direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{work.author_name}</Text>

          <Collapse startingHeight={20} in={show}>
            <Text color={"gray.500"}>{work.description}</Text>
          </Collapse>
          {work.description.length > 100 ? (
            <Text fontWeight={600} size="sm" onClick={handleToggle} mt="1rem">
              ...{show ? "Less" : "More"}
            </Text>
          ) : (
            ""
          )}
        </Stack>
        <Stack spacing={1}>
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
            <Text fontWeight={600} fontSize={"sm"}>
              {work.comments_count
                ? `View all ${work.comments_count} comments`
                : "Be the 1st to comment"}
            </Text>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}
