import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { Firebase } from "../utils/firebase";

import { AuthContext } from "../components/auth/Auth";
import CommunityCard from "../components/CommunityCard";

export default function Community({
  likes,
  setLikes,
  collections,
  setCollections,
  follwingWorks,
  setFollowingworks,
}) {
  const user = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    Firebase.getFollowingWorks(user.uid).then((data) => {
      setFollowingworks(data);
      data.forEach((item) => {
        if (item.liked_by.includes(user.uid)) {
          setLikes((pre) => [...pre, true]);
        } else {
          setLikes((pre) => [...pre, false]);
        }
        if (item.collected_by.includes(user.uid)) {
          setCollections((pre) => [...pre, true]);
        } else {
          setCollections((pre) => [...pre, false]);
        }
      });
    });
  }, []);

  async function handleLike(id, i, list) {
    if (!likes[i]) {
      Firebase.likeWork(user.uid, id, list);
    } else {
      Firebase.unlikeWork(user.uid, id, list);
    }

    const newLikeList = [...likes];
    newLikeList[i] = !newLikeList[i];
    setLikes(newLikeList);
  }

  if (follwingWorks.length === 0)
    return <div>Go 'Explore' to follow more users</div>;
  return (
    <Container mt={16}>
      {follwingWorks.map((work, i) => (
        <CommunityCard
          key={work.id}
          work={work}
          i={i}
          likes={likes}
          handleLike={handleLike}
          location={location}
          collections={collections}
          setCollections={setCollections}
          follwingWorks={follwingWorks}
        />
      ))}
    </Container>
  );
}
