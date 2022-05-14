import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Container, Flex } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";

import { AuthContext } from "../components/auth/Auth";
import CommunityCard from "../components/CommunityCard";
import Loader from "../components/Loader";

export default function Community({ followingWorks, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);
  const location = useLocation();

  //fixme onsnapshot community!
  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setFollowingWorks(data);
    });
  }, []);

  if (loading && followingWorks.length === 0) return <Loader />;

  if (followingWorks.length === 0)
    return (
      <Flex h="100vh" justify="center" align="center">
        Go 'Explore' to follow more users
      </Flex>
    );

  return (
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
  );
}
