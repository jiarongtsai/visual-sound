import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  Flex,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
  Box,
  Tag,
  HStack,
} from "@chakra-ui/react";
import Gallery from "../../components/gallery/Gallery";
import { Firebase } from "../../utils/firebase";
import SequencerPlayOnly from "../../components/sequencer/SequencerPlayOnly";
import Collect from "../../components/interaction/Collect";
import Like from "../../components/interaction/Like";
import Comment from "../../components/interaction/Comment";
import { UserSmall } from "../../components/userVariants/UserSmall";

export default function WorkView({ setFollowingWorks }) {
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [comments, setComments] = useState([]);
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const [isShown, setIsShown] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    const snapshot = Firebase.snapshotWork(id, (data) => {
      setWork(data);
    });

    return () => {
      snapshot();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(work).length === 0) return;
    Firebase.getRelatedWorks(work.author_id, work.tags).then((data) => {
      setRelatedWorks(data);
      setIsShown(Array(data.length).fill(false));
    });
  }, [work]);

  useEffect(() => {
    const onSnapshotComments = Firebase.onSnapshotComments(
      id,
      async (snapshot) => {
        const result = await Promise.all(
          snapshot.docs.map(async (item) => {
            const authorInfo = await Firebase.getUserBasicInfo(
              item.data().author_id
            );
            return {
              id: item.id,
              ...item.data(),
              ...authorInfo,
            };
          })
        );
        setComments(result);
      }
    );
    return () => {
      onSnapshotComments();
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  if (!work) return <div>Work Not Found</div>;

  return (
    <>
      <Flex
        mt={12}
        mx="auto"
        w="90%"
        h="100%"
        rounded="md"
        p={8}
        maxW="960px"
        border="1px"
        borderColor={borderColor}
        bg={bgColor}
        direction={["column", "column", "row"]}
        justify="space-between"
      >
        <Flex direction="column" w={["100%", "100%", "60%"]}>
          <SequencerPlayOnly
            imageUrl={work.image_url}
            sheetmusic={work.sheetmusic}
            bpm={work.bpm}
            themeColor={work.themeColor}
          />
        </Flex>
        <Flex direction="column" w={["100%", "100%", "35%"]}>
          <VStack
            align="flex-start"
            h="43vh"
            overflowY={"scroll"}
            p={1}
            pt={[4, 4, 0]}
            pl={[2, 2, 0]}
          >
            <UserSmall
              id={work.author_id}
              name={work.author_name}
              thumbnail={work.author_thumbnail}
            />

            <Text fontWeight="400" my={2} color="gray.500">
              {work.description}
            </Text>
            <HStack>
              {work.tags?.map((tag) => (
                <Tag size="md" key={tag} borderRadius="md" colorScheme="purple">
                  {tag}
                </Tag>
              ))}
            </HStack>
            <Text color={"gray.500"} fontSize="sm" width="100%" py={2}>
              {`Created at ${moment
                .unix(work.created_time?.seconds)
                .calendar()}`}
            </Text>

            {comments.map((comment) => {
              return (
                <div key={comment.id}>
                  <UserSmall
                    id={comment.author_id}
                    name={comment.author_name}
                    thumbnail={comment.author_thumbnail}
                  />

                  <Text color={"gray.500"} ml={9} mb={2}>
                    {comment.content}
                  </Text>
                </div>
              );
            })}
          </VStack>
          <div ref={endRef}></div>
          <Flex align="center">
            <Like
              i={-1}
              id={work.id}
              likedList={work.liked_by}
              setFollowingWorks={setFollowingWorks}
            />
            <Text color={"gray.500"}>
              {work.liked_by?.length || 0}
              {work.liked_by?.length > 1 ? " likes" : " like"}
            </Text>
            <Spacer />
            <Collect
              i={-1}
              id={work.id}
              collectedList={work.collected_by}
              setFollowingWorks={setFollowingWorks}
            />
          </Flex>
          <Flex align="center" justify="center" pt={2}>
            <Comment i={-1} work={work} />
          </Flex>
        </Flex>
      </Flex>
      <Box my={16}>
        <Flex justify="center" align="center" mb={4}>
          <Text>Related Works</Text>
        </Flex>
        <Gallery
          works={relatedWorks}
          isShown={isShown}
          setIsShown={setIsShown}
        ></Gallery>
      </Box>
    </>
  );
}

WorkView.propTypes = {
  setFollowingWorks: PropTypes.func,
};
