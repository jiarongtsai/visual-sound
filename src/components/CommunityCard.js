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
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsChat, BsFillChatFill, BsCursorFill } from "react-icons/bs";
import Collect from "./interaction/Collect";
import Like from "./interaction/Like";
import { useState, useEffect, useContext } from "react";
import { UserWithTime } from "./UserVariants";
import { AuthContext } from "./auth/Auth";
import { Firebase } from "../utils/firebase";

export default function CommunityCard({
  i,
  work,
  location,
  setFollowingWorks,
}) {
  const user = useContext(AuthContext);
  const [comment, setComment] = useState(false);
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  function sendComment() {
    if (!input.trim()) return;
    const count = work.comments_count + 1 || 1;
    Firebase.addComment(user.uid, work.id, input, count).then(() => {
      const updatedLatestComment = [...work.latestComments];
      updatedLatestComment.push({
        author_id: user.uid,
        author_name: user.displayName,
        content: input,
      });

      setInput("");
    });
  }

  function sendCommentKeyDown(e) {
    if (e.key !== "Enter") return;
    sendComment();
  }

  return (
    <Center my={4}>
      <Box
        maxW={"640px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.900")}
        rounded={"md"}
        shadow="base"
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

        <Box
          bg={"gray.100"}
          pos={"relative"}
          mx={-4}
          borderTop="1px"
          borderBottom="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
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
          <Like
            i={i}
            id={work.id}
            likedList={work.liked_by}
            setFollowingWorks={setFollowingWorks}
          />

          {comment ? (
            <IconButton
              mr="auto"
              variant="ghost"
              aria-label="comment"
              icon={<BsFillChatFill />}
              onClick={() => setComment(!comment)}
            />
          ) : (
            <IconButton
              mr="auto"
              variant="ghost"
              aria-label="comment"
              icon={<BsChat />}
              onClick={() => setComment(!comment)}
            />
          )}
          <Spacer />
          <Collect
            i={i}
            id={work.id}
            collectedList={work.collected_by}
            setFollowingWorks={setFollowingWorks}
          />
        </Flex>
        <Stack mb={3} direction={"column"} spacing={0} fontSize={"sm"}>
          <Text fontWeight={600}>{work.author_name}</Text>

          <Collapse startingHeight={20} in={show}>
            <Text color={"gray.500"}>{work.description}</Text>
          </Collapse>
          {work.description.length > 100 ? (
            <Text
              fontWeight={600}
              size="sm"
              onClick={() => setShow(!show)}
              mt="1rem"
              cursor="pointer"
            >
              ...{show ? "Less" : "More"}
            </Text>
          ) : (
            ""
          )}
        </Stack>
        <Stack spacing={1}>
          {work.latestComments?.map((comment, i) => {
            return (
              <Box key={i} fontSize={"sm"}>
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
        <Stack>
          <Collapse in={comment}>
            <InputGroup m={1} mt={2} w="98%" size="sm" position="relative">
              <Input
                rounded="full"
                placeholder="Leave a comment....."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={sendCommentKeyDown}
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  rounded="full"
                  position="absolute"
                  right={2}
                  aria-label="Search database"
                  icon={<BsCursorFill />}
                  onClick={sendComment}
                />
              </InputRightElement>
            </InputGroup>
          </Collapse>
        </Stack>
      </Box>
    </Center>
  );
}
