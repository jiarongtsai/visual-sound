import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  MenuItem,
  MenuItemOption,
  MenuOptionGroup,
  MenuList,
  MenuButton,
  Box,
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

export default function CollectWithCategory({ id, collectedList }) {
  const user = useContext(AuthContext);
  const [collectionData, setCollectionData] = useState({});
  const [selection, setSelection] = useState("");
  const [collect, setCollect] = useState(false);

  useEffect(() => {
    Firebase.getProfile(user?.uid).then((data) => {
      setCollectionData(data.collection_map);
    });

    setCollect(collectedList?.includes(user.uid) ? true : false);
  }, []);

  async function collectWork(collectionName) {
    await Firebase.collectWork(user.uid, id, collectedList);

    const collectionCopy = { ...collectionData };

    collectionCopy[collectionName]
      ? collectionCopy[collectionName].push(id)
      : (collectionCopy[collectionName] = [id]);

    await Firebase.collectWorkByCategory(user.uid, collectionCopy);

    setSelection("");
    setCollect(!collect);
  }

  async function uncollectWork() {
    const collectionCopy = { ...collectionData };

    const removedCollectionData = removeCollectionByID(collectionCopy, id);

    await Firebase.uncollectWork(
      user.uid,
      id,
      collectedList,
      removedCollectionData
    );
    setCollectionData(removedCollectionData);
    setSelection("");
    setCollect(!collect);
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
      {collect ? (
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
                defaultValue="...Type New Collection"
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
              {collectionData &&
                Object.keys(collectionData).map((term) => (
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
