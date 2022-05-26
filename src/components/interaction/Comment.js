import React, { useState, useContext } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { BsCursorFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";
import AlertModal from "../AlertModal";

export default function Comment({
  i,
  work,
  followingWorks,
  setFollowingWorks,
}) {
  const [user, loading, error] = useContext(AuthContext);
  const [input, setInput] = useState("");
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  function sendComment() {
    if (!input.trim()) return;

    const count = work.comments_count + 1 || 1;
    Firebase.addComment(user.uid, work.id, input, count).then(() => {
      if (i >= 0) {
        const updatedLatestComment = [...followingWorks[i].latestComments];
        updatedLatestComment.push({
          author_id: user.uid,
          author_name: user.displayName,
          content: input,
        });
        setFollowingWorks((pre) => [
          ...pre.slice(0, i),
          {
            ...pre[i],
            comments_count: count,
            latestComments: updatedLatestComment,
          },
          ...pre.slice(i + 1),
        ]);
      }
      setInput("");
    });
  }

  function sendCommentKeyDown(e) {
    if (e.key !== "Enter") return;
    sendComment();
  }

  return (
    <>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        content="Only Registered users could leave comments."
      />
      <InputGroup
        m={1}
        mt={2}
        w="98%"
        size="sm"
        position="relative"
        style={{ zIndex: "0" }}
        onClick={!user && onAlertOpen}
        opacity={!user && "0.7"}
      >
        <Input
          rounded="full"
          placeholder="Leave a comment....."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={sendCommentKeyDown}
          pointerEvents={!user && "none"}
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
            pointerEvents={!user && "none"}
          />
        </InputRightElement>
      </InputGroup>
    </>
  );
}

Comment.propTypes = {
  i: PropTypes.number,
  work: PropTypes.object,
  followingWorks: PropTypes.array,
  setFollowingWorks: PropTypes.func,
};
