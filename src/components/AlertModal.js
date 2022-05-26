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
} from "@chakra-ui/react";

export default function AlertModal({ isOpen, onClose, content }) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent mt="30%">
        <ModalHeader>Not Login?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
        <ModalFooter>
          <Button colorScheme={"gray"} onClick={onClose} mr={3}>
            Back
          </Button>
          <Button colorScheme={"purple"} onClick={() => navigate("/login")}>
            Login/Register
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

AlertModal.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  content: PropTypes.string,
};
