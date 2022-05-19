import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  MenuItem,
  MenuOptionGroup,
  MenuList,
  MenuButton,
  useColorModeValue,
  Link,
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { AuthContext } from "../auth/Auth";
import { Firebase } from "../../utils/firebase";

export default function Collect({ i, id, collectedList, setFollowingWorks }) {
  const [user, loading, error] = useContext(AuthContext);
  const [collectionMap, setCollectionMap] = useState({});
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!user) return;
    const snapshot = Firebase.onSnapshotProfile(user.uid, (data) => {
      setCollectionMap(data.collection_map);
    });
    return () => {
      snapshot();
    };
  }, [user]);

  //可以收藏到不只一個collection 嗎？ 還沒試
  async function collectWork(collectionName) {
    if (!collectionName.trim()) return;

    const updatedCollectedByList = [...collectedList];
    updatedCollectedByList.push(user.uid);

    await Firebase.collectWork(id, updatedCollectedByList);

    const collectionCopy = { ...collectionMap };

    collectionCopy[collectionName]
      ? collectionCopy[collectionName].push(id)
      : (collectionCopy[collectionName] = [id]);

    await Firebase.collectWorkByCategory(user.uid, collectionCopy);

    setInput("");

    i >= 0 &&
      setFollowingWorks((pre) => [
        ...pre.slice(0, i),
        { ...pre[i], collected_by: updatedCollectedByList },
        ...pre.slice(i + 1),
      ]);
  }

  async function uncollectWork() {
    const collectionCopy = { ...collectionMap };
    const updatedCollectionMap = removeCollectionByID(collectionCopy, id);

    const updatedCollectedByList = collectedList.filter(
      (id) => id !== user.uid
    );

    await Firebase.uncollectWork(
      id,
      updatedCollectedByList,
      user.uid,
      updatedCollectionMap
    );

    setInput("");
    i >= 0 &&
      setFollowingWorks((pre) => [
        ...pre.slice(0, i),
        { ...pre[i], collected_by: updatedCollectedByList },
        ...pre.slice(i + 1),
      ]);
  }

  function removeCollectionByID(obj, id) {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const index = value.findIndex((v) => v === id);
      if (index >= 0) {
        value.splice(index, 1);
      }
      result[key] = value;
    }

    return result;
  }

  const color = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      {collectedList?.includes(user?.uid) ? (
        <IconButton
          variant="ghost"
          aria-label="collected"
          icon={<BsFillBookmarkFill />}
          py={1}
          px={0.25}
          onClick={uncollectWork}
        />
      ) : (
        <Menu>
          <MenuButton
            as={Link}
            rounded={"md"}
            cursor={"pointer"}
            _hover={{
              textDecoration: "none",
              bg: color,
            }}
          >
            <IconButton
              variant="ghost"
              aria-label="collect"
              icon={<BsBookmark />}
            />
          </MenuButton>
          <MenuList>
            <MenuOptionGroup>
              <Editable
                defaultValue="+ New collection name..."
                onSubmit={() => collectWork(input)}
              >
                <EditablePreview px={3} />
                <EditableInput
                  mx={3}
                  w="90%"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </Editable>
              {collectionMap &&
                Object.keys(collectionMap).map((term) => (
                  <MenuItem
                    key={term}
                    value={term}
                    onClick={() => collectWork(term)}
                  >
                    {term}
                  </MenuItem>
                ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
