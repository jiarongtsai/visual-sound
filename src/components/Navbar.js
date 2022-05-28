import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
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
  Divider,
  Stack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  CloseButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "./auth/Auth";
import NavLink from "./NavLink";

const Links = [
  { value: "", label: "Create" },
  { value: "community", label: "Community" },
  { value: "explore", label: "Explore" },
  { value: "message", label: "Message" },
];

export default function Navbar() {
  const [user, loading, error] = useContext(AuthContext);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [breakPoint] = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (!breakPoint) {
      onClose();
    }
  }, [breakPoint]);

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
          shadow="base"
        >
          <IconButton
            ml={2}
            mr={[0, 0, 14]}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={onOpen}
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
                <Heading as="h4" fontSize="21px" fontFamily="Exo 2, sans-serif">
                  Visual Sound
                </Heading>
              </Button>
            </Box>
            <HStack as={"nav"} display={{ base: "none", md: "flex" }}>
              {Links.map((link, i) => (
                <NavLink key={i} to={link.value}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button variant={"ghost"} onClick={toggleColorMode} mr={[4, 4, 0]}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Box display={{ base: "none", md: "flex" }}>
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
            </Box>
          </Flex>
        </Flex>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <Box
              bg={useColorModeValue("gray.200", "gray.700")}
              shadow="base"
              h="100vh"
              display={{ md: "none" }}
            >
              <CloseButton onClick={onClose} p={1} m={4} ml="80%" />
              <Stack as={"nav"}>
                {Links.map((link, i) => (
                  <NavLink key={i} to={link.value} onClick={onClose}>
                    {link.label}
                  </NavLink>
                ))}
                <Divider />
                {user ? (
                  <>
                    <NavLink to="/profile" onClick={onClose}>
                      Profile
                    </NavLink>
                    <NavLink to="/profile/collection" onClick={onClose}>
                      My Collection
                    </NavLink>
                    <Divider />
                    <Button
                      justifyContent="flex-start"
                      pl={6}
                      fontWeight={600}
                      variant={"ghost"}
                      onClick={UserSignOut}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button
                    as={"a"}
                    justifyContent="flex-start"
                    pl={6}
                    fontWeight={600}
                    variant={"ghost"}
                    href={"/login"}
                  >
                    Sign In
                  </Button>
                )}
              </Stack>
            </Box>
          </DrawerContent>
        </Drawer>
      </Box>

      <Box
        minHeight="100vh"
        p={4}
        pt="64px"
        bg={useColorModeValue("gray.100", "gray.800")}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
