import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Flex,
  Text,
  Spacer,
  Button,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Firebase } from "../../utils/firebase";
import { UserWithName } from "../../components/UserVariants";
import { AuthContext } from "../../components/auth/Auth";
import CommunityCard from "./CommunityCard";
import Loader from "../../components/Loader";

export default function Community({ followingWorks, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);
  const location = useLocation();
  const [recommendUsers, setRecommendUsers] = useState([]);
  const bg = useColorModeValue("white", "gray.700");

  const [follow, setFollow] = useState([]);

  //fixme onsnapshot community!
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
      <Flex h="100vh" justify="center" align="center">
        Go 'Explore' to follow more users
      </Flex>
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
    <Flex>
      <VStack
        display={["none", "none", "none", "none", "initial"]}
        minWidth="300px"
        position="fixed"
        right={["0", "0", "0", "0", "5%", "10%"]}
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
      <Container pr={8}>
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
    </Flex>
  );
}
