import { useState, useEffect, useRef } from "react";
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
  Code,
} from "@chakra-ui/react";
import { BsFillCameraFill } from "react-icons/bs";

import JoyRide from "react-joyride";
import { is } from "@react-spring/shared";

export default function Main() {
  const TOUR_STEPS = [
    {
      target: "#tour-player",
      title: "Record Music",
      content: "Record music by clicking Record button",
    },
    {
      target: "#tour-edit-panel",
      title: "Edit your Record",
      content: "Edit your record and change colors with editing panel",
    },
    {
      target: "#tour-screenshot",
      title: "Screenshot a cover",
      content:
        "Before Uploading, remember to take a screenshot as the cover of your record",
    },
    {
      target: "#tour-upload",
      title: "Upload and Share",
      content: "Add description to your record, and share with the community",
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

  console.log(isOpen);

  useEffect(() => {
    if (isMounted.current) {
      if (!isOpen) {
        setTimeout(() => {
          setRunTour(true);
        }, 10000);
      }
    } else {
      isMounted.current = true;
    }
  }, [isOpen]);
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
        <ModalContent textAlign="center" mt="30vh">
          <ModalHeader></ModalHeader>
          <ModalBody>
            {/* add beautiful illustration */}
            <Text>Press any key, A to Z, and turn up speakers</Text>
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
