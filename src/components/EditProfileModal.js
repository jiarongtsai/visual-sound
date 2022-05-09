import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import { ModalBackground } from "./element/ModalBackground";
// import { ModalContent } from "./element/ModalContent";

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
  Image,
  Input,
  Textarea,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

import { BsPencilSquare } from "react-icons/bs";

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  setProfile,
}) {
  const user = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    user_bio: profile.user_bio,
    user_name: profile.user_name,
    user_thumbnail: profile.user_thumbnail,
  });
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!preview) setPreview(profile.user_thumbnail);
  }, [isOpen]);

  useEffect(() => {
    if (!inputs.user_thumbnail) return;

    const objectUrl = URL.createObjectURL(inputs.user_thumbnail);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [inputs]);

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  async function handelUpdate() {
    const imageUrl = await Firebase.uploadFile(
      inputs.user_thumbnail,
      "thumbnails"
    );
    await Firebase.updateProfile(
      user,
      inputs.user_name,
      inputs.user_bio,
      imageUrl
    );
    setProfile((pre) => ({
      ...pre,
      user_bio: inputs.user_bio,
      user_name: inputs.user_name,
      user_thumbnail: imageUrl,
    }));
    setInputs({});
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column">
            <Flex direction="column" align="center" position="relative">
              <Image
                src={preview}
                w="40%"
                rounded="full"
                border="1px"
                borderColor={useColorModeValue("gray.200", "gray.500")}
              />
              <label
                htmlFor="upload"
                style={{
                  height: "40px",
                  position: "absolute",
                  right: "30%",
                  bottom: "5%",
                  cursor: "pointer",
                }}
              >
                <Input
                  id="upload"
                  display="none"
                  name="user_thumbnail"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    setInputs({ ...inputs, user_thumbnail: e.target.files[0] })
                  }
                />
                <IconButton
                  pointerEvents="none"
                  colorScheme="purple"
                  aria-label="Update Profile Photo"
                  icon={<BsPencilSquare />}
                />
              </label>
            </Flex>
            <Flex direction="column" justify="center">
              <label>Username</label>
              <Input
                name="user_name"
                placeholder={profile.user_name}
                value={inputs.user_name || ""}
                onChange={(e) => handleInputs(e)}
              />
            </Flex>
            <Flex direction="column" justify="center">
              <label>Bio</label>
              <Textarea
                name="user_bio"
                rows="5"
                cols="50"
                overflow="scroll"
                placeholder={profile.user_bio}
                value={inputs.user_bio || ""}
                onChange={handleInputs}
              />
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="purple" onClick={handelUpdate}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
