import { memo, useContext } from "react";
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
  Text,
  Box,
} from "@chakra-ui/react";
import { UserWithName } from "./userVariants/UserWithName";
import { AuthContext } from "./auth/Auth";

export const UsersModal = memo(({ isOpen, onClose, action }) => {
  const [user, loading, error] = useContext(AuthContext);
  //Q: close modal 的function 是否需要useCallback？
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{action.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} h={"60vh"} overflowY={"scroll"} pr={4}>
            {action.userList?.length === 0 ? (
              <Text>It is empty</Text>
            ) : (
              action.userList?.map((renderUser) => {
                return (
                  <Flex
                    key={renderUser.author_id}
                    align="center"
                    justify="space-between"
                    w="100%"
                  >
                    <Box onClick={onClose}>
                      <UserWithName
                        id={renderUser.author_id}
                        name={renderUser.author_name}
                        thumbnail={renderUser.author_thumbnail}
                      />
                    </Box>
                    <Spacer />
                    {renderUser.author_id === user.uid ? (
                      <Button minW="80px" pointerEvents="none">
                        You
                      </Button>
                    ) : (
                      <Button
                        colorScheme="purple"
                        minW="80px"
                        onClick={() =>
                          action.invokeFunction(renderUser.author_id)
                        }
                      >
                        {action.buttonText}
                      </Button>
                    )}
                  </Flex>
                );
              })
            )}
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
});

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
