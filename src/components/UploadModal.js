import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
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
  Textarea,
  useColorModeValue,
  Box,
  Text,
  FormControl,
} from "@chakra-ui/react";
import { CreatableSelect } from "chakra-react-select";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import SequencerPlayOnly from "../components/sequencer/SequencerPlayOnly";
import Loader from "./Loader";

export default function UploadModal({
  sequence,
  bpm,
  image,
  themeColor,
  isOpen,
  onClose,
}) {
  const [user, loading, error] = useContext(AuthContext);
  const [inputs, setInputs] = useState({ description: "try to make a sound" });
  const [allTags, setAllTags] = useState([]);
  const borderColor = useColorModeValue("gray.300", "gray.800");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Firebase.getAllTags().then((data) => {
      setAllTags(data);
    });
  }, []);

  function handleInputs(e) {
    setInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  async function uploadtoFirebase() {
    const workRef = Firebase.getNewWorkRef();
    const workID = workRef.id;

    const blob = await (await fetch(image)).blob();
    const workFile = new File([blob], `${user.uid}_${workID}.png`, {
      type: "image/png",
    });

    const imageUrl = await Firebase.uploadFile(workFile, "images");
    const uploadTags = selectedOption.map((tag) => tag.value);

    const data = {
      author_id: user.uid,
      description: inputs.description,
      comments_count: 0,
      image_url: imageUrl,
      tags: uploadTags,
      collected_by: [],
      liked_by: [],
      sheetmusic: JSON.stringify(sequence),
      bpm: bpm,
      themeColor: themeColor,
    };

    await Firebase.addNewWork(workRef, data);
    await Firebase.updateTags([...new Set([...uploadTags, ...allTags])]);

    navigate(`/explore`);
  }

  if (loading) return <Loader />;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent h="80%">
        <ModalHeader
          borderBottom="1px"
          borderColor={borderColor}
          shadow={"base"}
        >
          Upload your new work
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6} h="60%" overflow="scroll">
          <Flex direction={["column", "column", "row"]} justify="space-between">
            <Flex
              direction="column"
              w={["100%", "100%", "68%"]}
              h={["30vh", "30vh", "100%"]}
            >
              <Text>Preview</Text>
              <SequencerPlayOnly
                sheetmusic={JSON.stringify(sequence)}
                bpm={bpm}
                themeColor={themeColor}
                imageUrl={image}
              />
            </Flex>
            <Flex direction="column" w={["100%", "100%", "30%"]}>
              <VStack
                align="flex-start"
                h={["auto", "auto", "65vh"]}
                overflowY={"scroll"}
                p={1}
                spacing={4}
              >
                <Text pt={4}>Edit Details</Text>

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
                    <Text color="gray.500" fontSize="sm" mb={2}>
                      Add Tags to your work
                    </Text>
                    <CreatableSelect
                      py={1}
                      isMulti
                      colorScheme="purple"
                      name="tags"
                      options={allTags.map((tag) => ({
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
        <ModalFooter
          borderTop="1px"
          borderColor={borderColor}
          boxShadow="rgba(0, 0, 0, 0.06) 0 -1px 3px 0"
        >
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

UploadModal.propTypes = {
  sequence: PropTypes.array,
  bpm: PropTypes.number,
  image: PropTypes.string,
  themeColor: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
