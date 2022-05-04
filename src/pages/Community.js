import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";

import { AuthContext } from "../components/auth/Auth";
import CommunityCard from "../components/CommunityCard";

export default function Community({ followingWorks, setFollowingWorks }) {
  const user = useContext(AuthContext);
  const location = useLocation();

  //fixme onsnapshot community!
  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      console.log(data);
      setFollowingWorks(data);
    });
  }, []);

  useEffect(() => {
    console.log(followingWorks);
  }, [followingWorks]);

  if (followingWorks.length === 0)
    return <div>Go 'Explore' to follow more users</div>;

  return (
    <Container mt={16}>
      {followingWorks.map((work, i) => (
        <CommunityCard
          i={i}
          key={work.id}
          work={work}
          location={location}
          setFollowingWorks={setFollowingWorks}
        />
      ))}
    </Container>
  );
}

/* <CommunityCard
          
        /> */
