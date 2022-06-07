import onboardingVisual from "../asset/illustration/visualsound.png";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Image,
  Code,
  Heading,
  Button,
} from "@chakra-ui/react";

export const OnboardingModal = ({ isOpen, onClose, breakPoint }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px) " />
      <ModalContent textAlign="center" mt="10vh">
        <ModalHeader></ModalHeader>
        <ModalBody h="100%">
          <Heading as="h4" fontSize="21px">
            Welcom to Visual Sound
          </Heading>
          <Text mt={2}>
            {breakPoint ? (
              <>
                <>Open edit panel, press a button,</>
                <br />
                <> and turn up speakers </>
              </>
            ) : (
              <>
                Press any key, <Code>A</Code> to <Code>Z</Code>, and turn up
                speakers
              </>
            )}
          </Text>

          <Image
            src={onboardingVisual}
            alt="cover iamge of Visual Sound"
            h={["30vh", "40vh", "50vh"]}
            mx="auto"
            mt={4}
          />

          {breakPoint && (
            <Text mt={4}>
              Swith to <strong>desktop</strong> for best experience
            </Text>
          )}
          <Button colorScheme="purple" onClick={onClose} mt={8}>
            {breakPoint ? "Keep using mobile" : "Start"}
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
