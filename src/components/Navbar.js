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
  Divider,
  Slide,
  Stack,
  Fade,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link, useLocation, useMatch, useResolvedPath } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { getAuth, signOut } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth/Auth";

const Links = [
  { value: "community", label: "Community" },
  { value: "explore", label: "Explore" },
  { value: "message", label: "Message" },
];

function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  const bgDefault = useColorModeValue("gray.100", "gray.600");

  return (
    <Box
      px={[6, 6, 3]}
      py={[4, 4, 2]}
      rounded={"md"}
      fontWeight={[400, 400, 600]}
      _hover={{
        bg: bgDefault,
      }}
    >
      <Link
        style={{
          borderBottom: match ? "2px solid #805ad5" : "",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </Box>
  );
}

export default function Navbar() {
  const [user, loading, error] = useContext(AuthContext);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onToggle } = useDisclosure();

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
            onClick={onToggle}
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
            <HStack as={"nav"} display={{ base: "none", md: "flex" }}>
              {Links.map((link, i) => (
                <CustomLink key={i} to={link.value}>
                  {link.label}
                </CustomLink>
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

        <Fade in={isOpen}>
          <Box
            w="100vw"
            h="100vh"
            bg="blackAlpha.600"
            position="fixed"
            top="0"
            left="0"
            display={{ md: "none" }}
            style={{ zIndex: 50 }}
          />
        </Fade>
        <Slide
          direction="left"
          in={isOpen}
          style={{ zIndex: 97 }}
          onClick={onToggle}
        >
          <Box
            mt="64px"
            bg={useColorModeValue("gray.200", "gray.700")}
            shadow="base"
            w="45vw"
            h="100vh"
            display={{ md: "none" }}
          >
            <Stack as={"nav"}>
              {Links.map((link, i) => (
                <CustomLink key={i} to={link.value}>
                  {link.label}
                </CustomLink>
              ))}
              <Divider />
              {user ? (
                <>
                  <CustomLink to="/profile">Profile</CustomLink>
                  <CustomLink to="/profile/collection">
                    My Collection
                  </CustomLink>
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
        </Slide>
      </Box>

      <Box
        style={{ minHeight: `calc(100% - 64px)` }}
        p={4}
        bg={useColorModeValue("gray.100", "gray.800")}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
