import { useContext } from "react";
import {
  Heading,
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { getAuth, signOut } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth/Auth";

const Links = ["community", "explore", "message"];

const NavLink = ({ children }) => (
  <Box
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
  >
    <Link to={children}>{children}</Link>
  </Box>
);

export default function Navbar() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function UserSignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
    });
  }

  return (
    <Box>
      <Box bg={useColorModeValue("gray.50", "gray.900")} position={"relative"}>
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          position={"fixed"}
          w="100%"
          bg={useColorModeValue("white", "gray.900")}
          style={{ zIndex: 99 }}
        >
          <IconButton
            ml={2}
            mr={14}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Button
                ml={4}
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"ghost"}
                href={"/"}
              >
                <Heading as="h4" size="md">
                  Visual Sound
                </Heading>
              </Button>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button variant={"ghost"} onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                  mx={4}
                >
                  <Avatar size={"sm"} src={user.photoURL} />
                </MenuButton>
                <MenuList>
                  <Link to="/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <Link to="/profile/collection">
                    <MenuItem>My Collection</MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={UserSignOut}>Log out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={400}
                variant={"ghost"}
                href={"/login"}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={6}>
              <br />
              <br />
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box minH="100vh" p={4} bg={useColorModeValue("gray.100", "gray.800")}>
        <Outlet />
      </Box>
    </Box>
  );
}
