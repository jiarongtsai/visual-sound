import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import styled from "styled-components";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import CollectWithCategory from "../pages/CollectWithCategory";
import { UserSmall } from "../components/UserVariants";
import {
  Flex,
  IconButton,
  Spacer,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { BsHeart, BsHeartFill, BsCursorFill } from "react-icons/bs";
import { AuthContext } from "../components/auth/Auth";
import Gallery from "../components/Gallery";

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TagWrapper = styled.div`
  background-color: gray;
  color: white;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  margin-right: 0.5rem;
  display: flex;
`;

export default function WorkView({ collections, setCollections }) {
  const user = useContext(AuthContext);
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);

  const borderColor = useColorModeValue("gray.200", "gray.500");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const [isShown, setIsShown] = useState([]);

  useEffect(() => {
    (async () => {
      const workData = await Firebase.getWork(id);
      setLike(workData.liked_by.includes(user?.uid));
      setWork(workData);

      const relatedResult = await Firebase.getRelatedWorks(
        workData.author_id,
        workData.tags
      );
      setRelatedWorks(relatedResult);
    })();
  }, []);

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

  function sendComment() {
    if (!input.trim()) return;
    const count = comments.length + 1 || 1;
    Firebase.addComment(user.uid, id, input, count).then(() => {
      setInput("");
    });
  }

  function sendCommentKeyDown(e) {
    if (e.key !== "Enter") return;
    sendComment();
  }

  async function handleLike(id, list) {
    if (!like) {
      await Firebase.likeWork(user.uid, id, list);
    } else {
      await Firebase.unlikeWork(user.uid, id, list);
    }

    setLike(!like);
  }

  if (!work) return <div>Work Not Found</div>;
  return (
    <>
      <Flex
        mt={24}
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
          <PlayerProvider>
            {({ soundPlayer }) => {
              return (
                <SequencePlayer
                  player={soundPlayer}
                  sheetmusic={work.sheetmusic}
                  bpm={work.bpm}
                  themeColor={work.themeColor}
                />
              );
            }}
          </PlayerProvider>
        </Flex>
        <Flex direction="column" w={["100%", "100%", "35%"]}>
          <VStack align="flex-start" h="43vh" overflowY={"scroll"} p={1}>
            <UserSmall
              id={work.author_id}
              name={work.author_name}
              thumbnail={work.author_thumbnail}
            />

            <Text fontWeight="400" my={2} color="gray.500" minH="60px">
              {work.description}
            </Text>
            <TagsContainer>
              {work.tags?.map((tag) => (
                <TagWrapper key={tag}>{tag}</TagWrapper>
              ))}
            </TagsContainer>
            <Text color={"gray.500"} fontSize="sm" width="100%" py={2}>
              {`Created at ${work.created_time
                ?.toDate()
                .toDateString()
                .slice(4, 25)}`}
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

          <Flex align="center">
            {like ? (
              <IconButton
                pt={1}
                variant="ghost"
                aria-label="like"
                icon={<BsHeartFill />}
                onClick={() => handleLike(work.id, work.liked_by)}
              />
            ) : (
              <IconButton
                pt={1}
                variant="ghost"
                aria-label="like"
                icon={<BsHeart />}
                onClick={() => handleLike(work.id, work.liked_by)}
              />
            )}
            <Text color={"gray.500"}>{`${work.liked_by?.length} likes`}</Text>
            <Spacer />
            <CollectWithCategory
              id={work.id}
              // workIndex={workIndex}
              collectedList={work.collected_by}
              collections={collections}
              setCollections={setCollections}
            />
          </Flex>
          <Flex align="center" justify="center" pt={2}>
            <InputGroup size="md" position="relative">
              <Input
                rounded="full"
                placeholder="Leave comment....."
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
          </Flex>
        </Flex>
      </Flex>
      <Box my={16}>
        <Gallery
          works={relatedWorks}
          isShown={isShown}
          setIsShown={setIsShown}
        ></Gallery>
      </Box>
    </>
  );
}
