import { useState, useEffect, useRef } from "react";
import Sequencer from "../components/sequencer/Sequencer";
import {
  useDisclosure,
  useToast,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import { OnboardingModal } from "../components/OnboradingModal";
import JoyRide from "react-joyride";

export default function Main() {
  const TOUR_STEPS = [
    {
      target: "#tour-player",
      title: "Record the Music",
      content: "Record music by clicking the Record button",
    },
    {
      target: "#tour-edit-panel",
      title: "Edit your Recording",
      content: "Edit your recording and change colors with the editing panel",
    },
    {
      target: "#tour-screenshot",
      title: "Choose a Cover",
      content:
        "Before Uploading, remember to take a screenshot as the cover of your recording",
    },
    {
      target: "#tour-upload",
      title: "Share with Others",
      content:
        "Add a description to your recording, and share it with the Visual Sound community",
    },
  ];
  const [breakPoint] = useMediaQuery("(max-width: 767px)");
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
          duration: 3000,
          render: () => (
            <Button
              mt="40vh"
              mx="auto"
              colorScheme="purple"
              w="300px"
              textAlign="center"
              h={breakPoint ? "65px" : "40px"}
            >
              {breakPoint ? (
                <>
                  <>Open edit panel, press a button,</>
                  <br />
                  <> and turn up speakers </>
                </>
              ) : (
                "Press A to Z, and turn up speakers"
              )}
            </Button>
          ),
        });
        if (JSON.parse(localStorage.getItem("hasRuntour"))) return;
        if (breakPoint) return;
        setTimeout(() => {
          setRunTour(true);
        }, 10000);
        localStorage.setItem("hasRuntour", "true");
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
        showProgress={true}
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
      <OnboardingModal
        isOpen={isOpen}
        onClose={onClose}
        breakPoint={breakPoint}
      />
      <Sequencer
        playing={playing}
        setPlaying={setPlaying}
        recording={recording}
        setRecording={setRecording}
      />
    </>
  );
}
