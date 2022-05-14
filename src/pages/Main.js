import { useState, useEffect } from "react";
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
  useToast,
  Button,
} from "@chakra-ui/react";
import { BsFillCameraFill } from "react-icons/bs";

export default function Main() {
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
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

  // useEffect(() => {
  //   if (!recording && !isOpen) {
  //     toast({
  //       position: "top-right",
  //       isClosable: true,
  //       duration: 3000,
  //       render: () => (
  //         <Button
  //           p={3}
  //           mt="128px"
  //           colorScheme="purple"
  //           isLoading
  //           spinner={<BsFillCameraFill />}
  //           loadingText="Take a screenshot before update!"
  //         >
  //           Take a screenshot before update!
  //         </Button>
  //       ),
  //     });
  //     // toast({
  //     //   title: "toast",
  //     //   position: "top-right",
  //     //   variant: "top-accent",

  //     // });
  //   }
  // }, [recording]);
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
        {({ soundPlayer }) => (
          <MySequencer
            player={soundPlayer}
            playing={playing}
            setPlaying={setPlaying}
            recording={recording}
            setRecording={setRecording}
          />
        )}
      </PlayerProvider>
    </>
  );
}
