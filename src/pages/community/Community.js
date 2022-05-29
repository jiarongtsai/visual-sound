import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Flex,
  Text,
  Spacer,
  Button,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import { UserWithName } from "../../components/userVariants/UserWithName";
import { AuthContext } from "../../components/auth/Auth";
import CommunityCard from "./CommunityCard";
import Loader from "../../components/Loader";
import { EmptyHandle } from "../../components/EmptyHandle";

export default function Community({ followingWorks, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);
  const location = useLocation();
  const [recommendUsers, setRecommendUsers] = useState([]);
  const bg = useColorModeValue("white", "gray.700");

  const [follow, setFollow] = useState([]);

  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setFollowingWorks(data);
    });

    Firebase.getRecommendFollower(user.uid).then((data) => {
      setRecommendUsers(data);
      setFollow(Array(data.length).fill(false));
    });
  }, []);

  if (loading && followingWorks.length === 0) return <Loader />;

  if (followingWorks.length === 0)
    return (
      <Box mt="30vh">
        <EmptyHandle
          showText="No works from following users yet."
          buttonText="Go Explore"
          link="/explore"
        />
      </Box>
    );

  async function handleFollow(i) {
    if (follow[i]) {
      await Firebase.unfollowUser(user.uid, recommendUsers[i].author_id);
    } else {
      await Firebase.followUser(user.uid, recommendUsers[i].author_id);
    }
    setFollow((pre) => [...pre.slice(0, i), !pre[i], ...pre.slice(i + 1)]);
  }
  return (
    <Flex
      maxW={"840px"}
      mx="auto"
      justify={{ base: "center", lg: "flex-start" }}
    >
      <Box w={["100%", "100%", "initial"]}>
        <Container>
          {followingWorks.map((work, i) => (
            <CommunityCard
              i={i}
              key={work.id}
              work={work}
              location={location}
              followingWorks={followingWorks}
              setFollowingWorks={setFollowingWorks}
            />
          ))}
        </Container>
      </Box>
      <Box ml={2}>
        <VStack
          display={{ base: "none", lg: "initial" }}
          minWidth="300px"
          position="fixed"
          top="84px"
          bg={bg}
          p={4}
          pb={6}
          rounded={"md"}
          shadow="base"
          spacing={3}
        >
          <Text w="100%" fontWeight={600}>
            People you might know
          </Text>
          {recommendUsers.map((user, i) => (
            <Flex
              key={user.author_id}
              justify="space-between"
              w="100%"
              alignItems="center"
            >
              <UserWithName
                id={user.author_id}
                name={user.author_name}
                thumbnail={user.author_thumbnail}
              />
              <Spacer />
              <Button onClick={() => handleFollow(i)} size="sm">
                {follow[i] ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}
