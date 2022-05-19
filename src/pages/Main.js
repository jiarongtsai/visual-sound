import { useState, useEffect, useRef } from "react";
import MySequencer from "../components/squencer/MySequencer";
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
  Image,
  Code,
  Heading,
  Button,
  Box,
} from "@chakra-ui/react";
import onboardingVisual from "../asset/illustration/visualsound.png";

import JoyRide from "react-joyride";

export default function Main() {
  const TOUR_STEPS = [
    {
      target: "#tour-player",
      title: "Record the Music",
      content: "Record music by clicking Record button",
    },
    {
      target: "#tour-edit-panel",
      title: "Edit your Recording",
      content: "Edit your recording and change colors with editing panel",
    },
    {
      target: "#tour-screenshot",
      title: "Choose a Cover",
      content:
        "Before Uploading, remember to take a screenshot as the cover of your recording",
    },
    {
      target: "#tour-upload",
      title: "Share with Public",
      content:
        "Add description to your recording, and share with the Visual Sound community",
    },
  ];

  const [runTour, setRunTour] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMounted = useRef(false);

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

  useEffect(() => {
    if (isMounted.current) {
      if (!isOpen) {
        toast({
          position: "top",
          isClosable: true,
          duration: 4000,
          render: () => (
            <Box w="100vw">
              <Button
                mt="40vh"
                mx="auto"
                colorScheme="purple"
                transform="translateX(55%)"
              >
                Press A to Z, and turn up speakers
              </Button>
            </Box>
          ),
        });
        setTimeout(() => {
          setRunTour(true);
        }, 10000);
        isMounted.current = false;
      }
    } else {
      isMounted.current = true;
    }
  }, [isOpen]);

  return (
    <>
      <JoyRide
        run={runTour}
        steps={TOUR_STEPS}
        continuous={true}
        showSkipButton={true}
        // showProgress={true}
        styles={{
          options: {
            primaryColor: "#805ad5",
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: "left",
          },
          buttonNext: {
            backgroundColor: "#805ad5",
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
        locale={{
          last: "End tour",
          skip: "Skip",
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px) " />
        <ModalContent textAlign="center" mt="10vh">
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Heading as="h4" fontSize="21px" fontFamily="Exo 2, sans-serif">
              Welcom to Visual Sound
            </Heading>
            <Text mt={2}>
              Press any key, <Code>A</Code> to <Code>Z</Code>, and turn up
              speakers
            </Text>
            <Image src={onboardingVisual} w="100%" mx="auto" mt={4} mb={8} />
            <Button colorScheme="purple" onClick={onClose}>
              Start
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <MySequencer
        playing={playing}
        setPlaying={setPlaying}
        recording={recording}
        setRecording={setRecording}
      />
    </>
  );
}
