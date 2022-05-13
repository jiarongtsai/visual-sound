import { useEffect } from "react";
import MySequencer from "../components/squencer/MySequencer";
import { PlayerProvider } from "../components/PlayerProvider";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    onOpen();
    window.addEventListener("keydown", () => {
      onClose();
    });

    return () => {
      window.removeEventListener("keydown", () => {
        onClose();
      });
    };
  }, []);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px) " />
        <ModalContent textAlign="center" mt="30vh">
          <ModalHeader></ModalHeader>
          <ModalBody>
            {/* add beautiful illustration */}
            <Text>Press any key, A to Z or 1 to 5, and turn up speakers</Text>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <PlayerProvider>
        {({ soundPlayer }) => <MySequencer player={soundPlayer} />}
      </PlayerProvider>
    </>
  );
}
