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
import { AuthContext } from "../components/auth/Auth";
import { Firebase } from "../utils/firebase";

export default function CollectWithCategory({
  id,
  collectedList,
  workIndex,
  collections,
  setCollections,
}) {
  const user = useContext(AuthContext);
  const [collectionMap, setCollectionMap] = useState({});
  const [selection, setSelection] = useState("");

  useEffect(() => {
    const snapshot = Firebase.onSnapshotProfile(user?.uid, (data) => {
      setCollectionMap(data.collection_map);
    });
    return () => {
      snapshot();
    };
  }, []);

  async function collectWork(collectionName) {
    await Firebase.collectWork(user.uid, id, collectedList);
    if (!collectionName || !collectionName.trim()) return;
    const collectionCopy = { ...collectionMap };

    collectionCopy[collectionName]
      ? collectionCopy[collectionName].push(id)
      : (collectionCopy[collectionName] = [id]);

    await Firebase.collectWorkByCategory(user.uid, collectionCopy);

    setSelection("");

    const newCollectionList = [...collections];
    newCollectionList[workIndex] = !newCollectionList[workIndex];
    setCollections(newCollectionList);
  }

  async function uncollectWork() {
    const collectionCopy = { ...collectionMap };

    const removedCollectionMap = removeCollectionByID(collectionCopy, id);

    await Firebase.uncollectWork(
      user.uid,
      id,
      collectedList,
      removedCollectionMap
    );

    setCollectionMap(removedCollectionMap);
    setSelection("");
    const newCollectionList = [...collections];
    newCollectionList[workIndex] = !newCollectionList[workIndex];
    setCollections(newCollectionList);
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
    <div>
      {collectedList?.includes(user?.uid) ? (
        <IconButton
          variant="ghost"
          aria-label="collected"
          icon={<BsFillBookmarkFill />}
          onClick={uncollectWork}
        />
      ) : (
        <Menu>
          <MenuButton
            as={Link}
            rounded={"md"}
            cursor={"pointer"}
            py={1}
            px={0.25}
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
                onSubmit={() => collectWork(selection)}
              >
                <EditablePreview px={3} />
                <EditableInput
                  mx={3}
                  w="90%"
                  value={selection}
                  onChange={(e) => setSelection(e.target.value)}
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
    </div>
  );
}
