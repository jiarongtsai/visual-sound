import React, { useContext } from "react";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react";

export default function Like({ i, id, likedList, setFollowingWorks }) {
  const user = useContext(AuthContext);

  async function handleLike() {
    let updatedLikedByList;
    if (likedList.includes(user.uid)) {
      updatedLikedByList = likedList.filter((id) => id !== user.uid);
      await Firebase.unlikeWork(id, updatedLikedByList);
    } else {
      updatedLikedByList = [...likedList];
      updatedLikedByList.push(user.uid);
      await Firebase.likeWork(id, updatedLikedByList);
    }
    setFollowingWorks &&
      setFollowingWorks((pre) => [
        ...pre.slice(0, i),
        { ...pre[i], liked_by: updatedLikedByList },
        ...pre.slice(i + 1),
      ]);
  }

  return (
    <>
      {likedList?.includes(user?.uid) ? (
        <IconButton
          pt={1}
          variant="ghost"
          aria-label="like"
          icon={<BsHeartFill />}
          onClick={() => handleLike(i)}
        />
      ) : (
        <IconButton
          pt={1}
          variant="ghost"
          aria-label="like"
          icon={<BsHeart />}
          onClick={() => handleLike(i)}
        />
      )}
    </>
  );
}
