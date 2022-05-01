import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  VStack,
  Text,
  Textarea,
  Image,
  Input,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

const TagsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TagWrapper = styled.div`
  background-color: gray;
  color: white;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  margin: 0.5rem;
  display: flex;
`;

const TagDelete = styled.span`
  margin-left: 0.5em;
  cursor: pointer;
`;

export default function UploadModal({
  sequence,
  bpm,
  setIsUploaded,
  image,
  setImage,
  themeColor,
  isOpen,
  onClose,
}) {
  const user = useContext(AuthContext);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const borderColor = useColorModeValue("gray.300", "gray.800");

  function handleInputs(e) {
    setInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  function handleTagInput(e) {
    const { key } = e;
    const trimmedInput = tagInput.trim();

    if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags([...tags, trimmedInput]);
      setTagInput("");
    }
  }

  function deleteTag(value) {
    setTags(tags.filter((tag) => tag != value));
  }

  function handleSequenceData(currentSequence) {
    for (let i = 0; i < currentSequence.length; i++) {
      for (let j = 0; j < currentSequence[i].length; j++) {
        const { activated } = currentSequence[i][j];
        currentSequence[i][j] = { activated };
      }
    }
    return JSON.stringify(currentSequence);
  }

  async function uploadtoFirebase() {
    const workRef = Firebase.getNewWorkRef();
    const workID = workRef.id;

    const blob = await (await fetch(image)).blob();
    const workFile = new File([blob], `${user.uid}_${workID}.png`, {
      type: "image/png",
    });

    const imageUrl = await Firebase.uploadFile(workFile, "images");

    const data = {
      author_id: user.uid,
      description: inputs.description,
      comments_count: 0,
      image_url: imageUrl,
      tags: tags,
      collected_by: [],
      liked_by: [],
      sheetmusic: handleSequenceData(sequence),
      bpm: bpm,
      themeColor: themeColor,
    };

    Firebase.addNewWork(workRef, data).then(() => {
      Firebase.updateTags(tags).then(() => {
        setInputs({});
        setTags([]);
        setTagInput("");

        setIsUploaded(true);
        setImage(null);
        onClose();
      });
    });
  }

  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          borderBottom="1px"
          borderColor={borderColor}
          shadow={"base"}
        >
          Upload your new work
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={["column", "row"]} justify="space-between">
            <Flex direction="column" w={["100%", "60%"]}>
              <Text>Preview</Text>
              <PlayerProvider>
                {({ soundPlayer }) => {
                  return (
                    <SequencePlayer
                      player={soundPlayer}
                      sheetmusic={handleSequenceData(sequence)}
                      bpm={bpm}
                      themeColor={themeColor}
                    />
                  );
                }}
              </PlayerProvider>
            </Flex>
            <Flex direction="column" w={["100%", "35%"]}>
              <VStack
                align="flex-start"
                h="55vh"
                overflowY={"scroll"}
                p={1}
                spacing={4}
              >
                <Text>Edit Details</Text>
                <Box>
                  <Text color="gray.500" fontSize="sm">
                    Screenshot
                  </Text>
                  {image && <Image src={image} w="100%" />}
                </Box>
                <Box w="100%">
                  <Text color="gray.500" fontSize="sm">
                    Description
                  </Text>
                  <Textarea
                    placeholder="Write somthing about your work"
                    name="description"
                    value={inputs.description || ""}
                    onChange={handleInputs}
                    h="30%"
                  />
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="sm">
                    Tag your post, and separeted your Tags by ","
                  </Text>
                  <TagsContainer>
                    {tags.map((tag) => (
                      <TagWrapper key={tag}>
                        {tag}
                        <TagDelete onClick={() => deleteTag(tag)}>X</TagDelete>
                      </TagWrapper>
                    ))}
                  </TagsContainer>
                  <Input
                    name="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagInput(e)}
                    placeholder="Add tags..."
                  />
                </Box>
              </VStack>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme={"gray"} onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme={"purple"} onClick={uploadtoFirebase}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
