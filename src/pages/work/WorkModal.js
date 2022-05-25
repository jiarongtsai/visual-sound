import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import SequencerPlayOnly from "../../components/sequencer/SequencerPlayOnly";
import { AuthContext } from "../../components/auth/Auth";
import Collect from "../../components/interaction/Collect";
import Like from "../../components/interaction/Like";
import Comment from "../../components/interaction/Comment";
import { UserWithTime } from "../../components/userVariants/UserWithTime";
import { UserSmall } from "../../components/userVariants/UserSmall";
import Loader from "../../components/Loader";

export default function WorkModal({ followingWorks, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [work, setWork] = useState({});
  const [comments, setComments] = useState([]);
  const endRef = useRef(null);
  const [index, setIndex] = useState(-1);

  const borderColor = useColorModeValue("gray.300", "gray.800");

  useEffect(() => {
    const snapshot = Firebase.snapshotWork(id, (data) => {
      setWork(data);
    });

    return () => {
      snapshot();
    };
  }, []);

  useEffect(() => {
    const currentIndex = followingWorks.findIndex((work) => work.id === id);
    setIndex(currentIndex);
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

  if (loading || Object.keys(work).length === 0) return <Loader />;

  return (
    <>
      <Modal size="6xl" isOpen={true} onClose={onDismiss}>
        <ModalOverlay />
        <ModalContent minHeight="80%">
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
              timestamp={work.created_time?.seconds}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={8} pb="0">
            <Flex
              direction={["column", "column", "row"]}
              justify="space-between"
            >
              <Flex direction="column" w={["100%", "100%", "68%"]}>
                <SequencerPlayOnly
                  imageUrl={work.image_url}
                  sheetmusic={work.sheetmusic}
                  bpm={work.bpm}
                  themeColor={work.themeColor}
                />
              </Flex>
              <Flex direction="column" w={["100%", "100%", "30%"]}>
                <VStack align="flex-start" h="55vh" overflowY={"scroll"} p={1}>
                  <UserSmall
                    id={work.author_id}
                    name={work.author_name}
                    thumbnail={work.author_thumbnail}
                  />

                  <Text fontWeight="400" my={2} color="gray.500">
                    {work.description}
                  </Text>
                  <HStack spacing={2} my={4}>
                    {work.tags?.map((tag) => (
                      <Tag
                        key={tag}
                        size="md"
                        borderRadius="md"
                        colorScheme="purple"
                      >
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
                  <div ref={endRef}></div>
                </VStack>
                <Flex align="center">
                  <Like
                    i={index}
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
                    i={index}
                    id={work.id}
                    collectedList={work.collected_by}
                    setFollowingWorks={setFollowingWorks}
                  />
                </Flex>

                <Flex align="center" justify="center" pt={2}>
                  <Comment
                    i={index}
                    work={work}
                    followingWorks={followingWorks}
                    setFollowingWorks={setFollowingWorks}
                  />
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

WorkModal.propTypes = {
  followingWorks: PropTypes.arrayOf(PropTypes.object),
  setFollowingWorks: PropTypes.func,
};
