import PropTypes from "prop-types";
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
  Spacer,
} from "@chakra-ui/react";
import { UserWithName } from "./userVariants/UserWithName";

export default function UsersModal({ isOpen, onClose, action }) {
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{action.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} h={"60vh"} overflowY={"scroll"} pr={4}>
            {action.userList?.map((user) => {
              return (
                <Flex key={user.author_id} justify="space-between" w="100%">
                  <UserWithName
                    id={user.author_id}
                    name={user.author_name}
                    thumbnail={user.author_thumbnail}
                  />
                  <Spacer />
                  <Button
                    colorScheme="purple"
                    onClick={() => action.invokeFunction(user.author_id)}
                  >
                    {action.buttonText}
                  </Button>
                </Flex>
              );
            })}
          </VStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

UsersModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  action: PropTypes.shape({
    name: PropTypes.string,
    userList: PropTypes.array,
    invokeFunction: PropTypes.func,
    buttonText: PropTypes.string,
  }),
};
