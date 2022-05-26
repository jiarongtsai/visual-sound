import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import Loader from "../components/Loader";

export default function Login() {
  const toast = useToast();
  const [user, loading, error] = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [isRegister, switchPanel] = useState(false);
  const [passwordwarning, setPasswordWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({
    email: "shane@visualsound.com",
    password: "visualsound",
  });
  const bg = useColorModeValue("white", "gray.700");
  const from = location.state?.from?.pathname || "/";
  const toastProps = {
    status: "error",
    variant: "subtle",
    duration: 3000,
    isClosable: true,
    position: "bottom-start",
  };
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  useEffect(() => {
    if (!inputs.checkPassword) return;
    if (inputs.password !== inputs.checkPassword) {
      setPasswordWarning(true);
    }
  }, [inputs]);

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function handelLogin() {
    if (!inputs.email || !inputs.email.match(emailFormat)) {
      toast({
        title: "Check your email",
        description: "Please enter a valid email. (ex: Emily@visualsound.com )",
        ...toastProps,
      });
      return;
    }
    if (!inputs.password || inputs.password.length < 7) {
      toast({
        title: "Check your Password",
        description:
          "Please enter a valid password. (between 6 to 20 characters)",
        ...toastProps,
      });
      return;
    }
    if (isRegister) {
      if (!inputs.username) {
        toast({
          title: "Username is required",
          description: "Please enter a username for your account.",
          ...toastProps,
        });
        return;
      }
      if (!inputs.checkPassword || inputs.password !== inputs.checkPassword) {
        toast({
          title: "Password does not match",
          description:
            "Please enter the same password in the check password field.",
          ...toastProps,
        });
        return;
      }
      Firebase.register(inputs.username, inputs.email, inputs.password).then(
        () => {
          navigate(from, { replace: true });
        }
      );
      return;
    }
    Firebase.login(inputs.email, inputs.password).then(() => {
      navigate(from, { replace: true });
    });
  }

  if (loading) return <Loader />;

  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Box rounded={"lg"} bg={bg} boxShadow={"base"} px={12} py={8}>
        <Stack align={"center"} mt={4} mb={8}>
          <Heading fontSize={"3xl"} textAlign={"center"}>
            {isRegister ? "Register" : "Sign in"}
          </Heading>
          <Text color={"gray.600"}>Enjoy the world of music</Text>
        </Stack>
        <Stack spacing={4}>
          {isRegister && (
            <FormControl id="firstName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={inputs.username || ""}
                onChange={(e) => handleInputs(e)}
              />
            </FormControl>
          )}
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              value={inputs.email}
              onChange={(e) => handleInputs(e)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputs.password}
                onChange={(e) => handleInputs(e)}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {isRegister && (
            <>
              <FormControl id="checkPassword" isRequired>
                <FormLabel>Check Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCheckPassword ? "text" : "password"}
                    name="checkPassword"
                    value={inputs.checkPassword}
                    onChange={(e) => handleInputs(e)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowCheckPassword(
                          (showCheckPassword) => !showCheckPassword
                        )
                      }
                    >
                      {showCheckPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {passwordwarning && (
                <Text color="red.500">Please enter the same password.</Text>
              )}
            </>
          )}
          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"purple.400"}
              color={"white"}
              _hover={{
                bg: "purple.500",
              }}
              onClick={handelLogin}
            >
              {isRegister ? "Register" : "Sign in"}
            </Button>
          </Stack>
          <Stack pt={6}>
            <Box align={"center"}>
              {isRegister ? (
                <Box>
                  Already a user?
                  <Link
                    ml={1}
                    color={"purple.400"}
                    onClick={() => switchPanel((pre) => !pre)}
                  >
                    Sign in
                  </Link>
                </Box>
              ) : (
                <Box>
                  Haven't have an a account?
                  <Link
                    ml={1}
                    color={"purple.400"}
                    onClick={() => switchPanel((pre) => !pre)}
                  >
                    Register
                  </Link>
                </Box>
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
