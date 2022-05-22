import React, { useContext } from "react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { IconButton } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";

export default function Like({ i, id, likedList, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);

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
    i >= 0 &&
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

Like.propTypes = {
  i: PropTypes.number,
  id: PropTypes.string,
  likedList: PropTypes.array,
  setFollowingWorks: PropTypes.func,
};
