import React, { useState, useContext, useEffect } from "react";
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
  HStack,
  Textarea,
  Image,
  Input,
  useColorModeValue,
  Box,
  Container,
  Text,
  Link,
  FormControl,
  FormLabel,
  Code,
  FormErrorMessage,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { CreatableSelect } from "chakra-react-select";

import { PlayerProvider } from "../components/PlayerProvider";
import SequencePlayer from "../components/SequencePlayer";

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
  const [alltags, setAlltags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const borderColor = useColorModeValue("gray.300", "gray.800");
  const [selectedOption, setSelectedOption] = useState(null);

  console.log(selectedOption);
  useEffect(() => {
    Firebase.getAllTags().then((data) => {
      setAlltags(data);
    });
  }, []);

  function handleInputs(e) {
    setInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  function handleTagInput(e) {
    const { key } = e;
    const trimmedInput = tagInput.trim();

    if (
      (key === "," || key === "Enter" || key === " ") &&
      trimmedInput.length &&
      !tags.includes(trimmedInput)
    ) {
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
      tags: selectedOption.map((tag) => tag.value),
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

  console.log(tags);

  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent minHeight="80%">
        <ModalHeader
          borderBottom="1px"
          borderColor={borderColor}
          shadow={"base"}
        >
          Upload your new work
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt={8} pb="0">
          <Flex direction={["column", "row"]} justify="space-between">
            <Flex direction="column" w={["100%", "100%", "68%"]}>
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
            <Flex direction="column" w={["100%", "100%", "30%"]}>
              <VStack
                align="flex-start"
                h="65vh"
                overflowY={"scroll"}
                p={1}
                spacing={4}
              >
                <Text>Edit Details</Text>
                <Box>
                  <Text color="gray.500" fontSize="sm">
                    Screenshot
                  </Text>
                  {image && (
                    <Image
                      src={image}
                      w="100%"
                      maxH="300px"
                      objectFit="cover"
                    />
                  )}
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
                    rows="7"
                    my={2}
                  />
                </Box>
                <Box w="100%">
                  <FormControl>
                    <Text color="gray.500" fontSize="sm" my={2}>
                      Add Tags to your work
                    </Text>
                    <CreatableSelect
                      py={1}
                      isMulti
                      colorScheme="purple"
                      name="tags"
                      options={alltags.map((tag) => ({
                        value: tag,
                        label: tag,
                      }))}
                      defaultValue={selectedOption}
                      onChange={setSelectedOption}
                      placeholder="Tag your work..."
                      closeMenuOnSelect={false}
                    />
                  </FormControl>
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
