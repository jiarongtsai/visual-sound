import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";
import { AuthContext } from "../components/auth/Auth";
import CollectWithCategory from "../pages/CollectWithCategory";
import { UserWithTime, UserSmall } from "./UserVariants";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
  IconButton,
  Spacer,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsHeart, BsHeartFill, BsCursorFill } from "react-icons/bs";

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

export default function WorkModal({
  likes,
  setLikes,
  collections,
  setCollections,
  follwingWorks,
}) {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const workIndex = follwingWorks
    .map((work) => work.id.includes(id))
    .findIndex((include) => include);

  const [work, setWork] = useState({});
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const endRef = useRef(null);

  const borderColor = useColorModeValue("gray.300", "gray.800");

  useEffect(() => {
    if (workIndex < 0) {
      Firebase.getWork(id).then((data) => {
        setLike(data.liked_by.includes(user.uid));
        setWork(data);
      });
      return;
    }

    setWork(follwingWorks[workIndex]);
    setLike(likes[workIndex]);
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

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  function onDismiss() {
    navigate(-1);
  }

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
    const newLikeList = [...likes];
    newLikeList[workIndex] = !newLikeList[workIndex];
    setLikes(newLikeList);
  }

  if (!work || !user) return null;

  return (
    <>
      <Modal size="4xl" isOpen={true} onClose={onDismiss}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            pb={0}
            borderBottom="1px"
            borderColor={borderColor}
            shadow={"base"}
          >
            <UserWithTime
              id={work.author_id}
              name={work.author_name}
              thumbnail={work.author_thumbnail}
              time={work.created_time?.toDate().toDateString()}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={["column", "row"]} justify="space-between">
              <Flex direction="column" w={["100%", "60%"]}>
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
              <Flex direction="column" w={["100%", "35%"]}>
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
                  <div ref={endRef}></div>
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
                  {/* fixme // need to update as well */}
                  <Text
                    color={"gray.500"}
                  >{`${work.liked_by?.length} likes`}</Text>
                  <Spacer />
                  <CollectWithCategory
                    id={work.id}
                    workIndex={workIndex}
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
                {/* <input
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                  <button onClick={sendComment}>send</button> */}
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
