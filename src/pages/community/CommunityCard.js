import React, { useState } from "react";
import PropTypes from "prop-types";
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
import { BsChat, BsFillChatFill } from "react-icons/bs";
import Collect from "../../components/interaction/Collect";
import Like from "../../components/interaction/Like";
import Comment from "../../components/interaction/Comment";
import { UserWithTime } from "../../components/userVariants/UserWithTime";
import SequencerMotionOnly from "../../components/sequencer/SequencerMotionOnly";

export default function CommunityCard({
  i,
  work,
  location,
  followingWorks,
  setFollowingWorks,
}) {
  const [comment, setComment] = useState(false);
  const [show, setShow] = useState(false);
  const [previewVisual, setPreviewVisual] = useState(false);
  const contentColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Center my={5}>
      <Box
        maxW={"640px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.700")}
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
          timestamp={work.created_time.seconds}
        />

        <Box
          bg={"gray.100"}
          pos={"relative"}
          mx={-4}
          borderTop="1px"
          borderBottom="1px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <Link
            to={`/work/${work.id}`}
            state={{ backgroundLocation: location }}
          >
            <Box
              h={[400, 550]}
              w={[400, 550]}
              position="absolute"
              pointerEvents="none"
              d={previewVisual ? "block" : "none"}
              overflow="hidden"
            >
              <SequencerMotionOnly
                sheetmusic={work.sheetmusic}
                bpm={work.bpm}
                themeColor={work.themeColor}
                isHover={previewVisual}
              />
            </Box>
            <Image
              h={[400, 550]}
              w={[400, 550]}
              src={work.image_url}
              objectFit="cover"
              onMouseEnter={() => setPreviewVisual(true)}
              onMouseLeave={() => setPreviewVisual(false)}
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
            <Text color={contentColor}>{work.description}</Text>
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
                <Text color={contentColor} as={"span"}>
                  {comment.content}
                </Text>
              </Box>
            );
          })}

          {work.comments_count ? (
            <Link
              to={`/work/${work.id}`}
              state={{ backgroundLocation: location }}
            >
              <Text fontWeight={600} fontSize={"sm"}>
                View all {work.comments_count}
                {work.comments_count > 1 ? " comments" : " comment"}
              </Text>
            </Link>
          ) : (
            <Text
              fontWeight={600}
              fontSize={"sm"}
              cursor="pointer"
              onClick={() => setComment(!comment)}
            >
              Be the 1st to comment
            </Text>
          )}
        </Stack>

        <Stack>
          <Collapse in={comment}>
            <Comment
              i={i}
              work={work}
              followingWorks={followingWorks}
              setFollowingWorks={setFollowingWorks}
            />
          </Collapse>
        </Stack>
      </Box>
    </Center>
  );
}

CommunityCard.propTypes = {
  i: PropTypes.number,
  work: PropTypes.object,
  location: PropTypes.object, //specific location object?
  followingWorks: PropTypes.arrayOf(PropTypes.object),
  setFollowingWorks: PropTypes.func,
};
