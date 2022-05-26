import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Firebase } from "../../utils/firebase";
import { AuthContext } from "../../components/auth/Auth";

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
import Loader from "../../components/Loader";

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  setProfile,
}) {
  const [user, loading, error] = useContext(AuthContext);
  const [inputs, setInputs] = useState({});
  const [preview, setPreview] = useState("");
  const borderColor = useColorModeValue("gray.200", "gray.500");

  useEffect(() => {
    setInputs({
      user_bio: profile.user_bio,
      user_name: profile.user_name,
      user_thumbnail: profile.user_thumbnail,
    });
  }, [profile]);

  useEffect(() => {
    if (!preview) setPreview(profile.user_thumbnail);
  }, [isOpen]);

  useEffect(() => {
    if (!inputs.user_thumbnail) return;
    if (inputs.user_thumbnail === profile.user_thumbnail) return;

    const objectUrl = URL.createObjectURL(inputs.user_thumbnail);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [inputs]);

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  async function handelUpdate() {
    let imageUrl;
    if (inputs.user_thumbnail !== profile.user_thumbnail) {
      imageUrl = await Firebase.uploadFile(inputs.user_thumbnail, "thumbnails");
    } else {
      imageUrl = profile.user_thumbnail;
    }
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

  if (loading) return <Loader />;

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
                w="180px"
                h="180px"
                objectFit="cover"
                rounded="full"
                border="1px"
                borderColor={borderColor}
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
            <Flex direction="column" justify="center" mt={2}>
              <label>Username</label>
              <Input
                name="user_name"
                placeholder={profile.user_name}
                value={inputs.user_name || ""}
                onChange={(e) => handleInputs(e)}
              />
            </Flex>
            <Flex direction="column" justify="center" mt={2}>
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

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  profile: PropTypes.object,
  setProfile: PropTypes.func,
};
