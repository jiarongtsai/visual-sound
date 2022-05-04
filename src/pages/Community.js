import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Container, Box } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";

import { AuthContext } from "../components/auth/Auth";
import CommunityCard from "../components/CommunityCard";

export default function Community({ followingWorks, setFollowingWorks }) {
  const user = useContext(AuthContext);
  const location = useLocation();

  //fixme onsnapshot community!
  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setFollowingWorks(data);
    });
  }, []);

  if (followingWorks.length === 0)
    return (
      <Box mt={16} mx="auto">
        Go 'Explore' to follow more users
      </Box>
    );

  return (
    <Container mt={16}>
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
