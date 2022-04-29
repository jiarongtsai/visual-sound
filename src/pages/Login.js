import React, { useEffect, useState } from "react";
import {
  Flex,
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { Firebase } from "../utils/firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, switchPanel] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({
    email: "jiarongtsai19@gmail.com",
    password: "web123",
  });

  const from = location.state?.from?.pathname || "/";

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function handelLogin() {
    if (isRegister) {
      Firebase.register(inputs.username, inputs.email, inputs.password).then(
        () => {
          navigate(from, { replace: true });
        }
      );
      return;
    }
    Firebase.login(inputs.email, inputs.password).then((data) => {
      navigate(from, { replace: true });
    });
  }

  //fix me: login with FB
  function loginFB() {
    Firebase.SignInWithFB().then((result) => {
      console.log(result);
      navigate(from, { replace: true });
    });
  }
  //fix me: forgot password
  function forgotPassword() {
    console.log("I forgot");
  }

  return (
    <Stack spacing={8} mt={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          {isRegister ? "Register" : "Sign In"}
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          to enjoy the world of music
        </Text>
      </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={4}>
          {isRegister ? (
            <FormControl id="firstName" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                name="username"
                value={inputs.username || ""}
                onChange={(e) => handleInputs(e)}
              />
            </FormControl>
          ) : (
            ""
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
                  Already a user ?
                  <Link
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
                    color={"purple.400"}
                    onClick={() => switchPanel((pre) => !pre)}
                  >
                    Register
                  </Link>
                  <br />
                  <Link color={"purple.400"} onClick={forgotPassword}>
                    Forgot Password ?
                  </Link>
                </Box>
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
    // </Flex>
  );
}

// ('Already a user? '< Link color={"purple.400"}>Login</>) :
//                 'Haven't have an a account?'

function SignIn() {}

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [inputs, setInputs] = useState({});

//   const from = location.state?.from?.pathname || "/";

//   function handleInputs(e) {
//     setInputs({ ...inputs, [e.target.name]: e.target.value });
//   }
//   function loginFirebase() {
//     Firebase.login(inputs.email, inputs.password).then((data) => {
//       console.log(data);
//       navigate(from, { replace: true });
//     });
//   }

//   function registerFirebase() {
//     Firebase.register(inputs.username, inputs.email, inputs.password).then(
//       (data) => {
//         console.log(data);
//         navigate(from, { replace: true });
//       }
//     );
//   }

//   function loginFB() {
//     Firebase.SignInWithFB().then((result) => {
//       console.log(result);
//       navigate(from, { replace: true });
//     });
//   }

//   return (
//     <>
//       <br />
//       <div>Login</div>
//       <div>
//         <label>email</label>
//         <input
//           name="email"
//           value={inputs.email || ""}
//           onChange={(e) => handleInputs(e)}
//         />
//       </div>
//       <div>
//         <label>password</label>
//         <input
//           type="password"
//           name="password"
//           value={inputs.password || ""}
//           onChange={(e) => handleInputs(e)}
//         ></input>
//       </div>
//       <button onClick={loginFirebase}>Login</button>
//       <button onClick={loginFB}>Login with FB</button>
//       <hr />
//       <br />
//       <div>Register</div>
//       <div>
//         <label>username</label>
//         <input
//           name="username"
//           value={inputs.username || ""}
//           onChange={(e) => handleInputs(e)}
//         ></input>
//       </div>
//       <div>
//         <label>email</label>
//         <input
//           name="email"
//           value={inputs.email || ""}
//           onChange={(e) => handleInputs(e)}
//         ></input>
//       </div>
//       <div>
//         <label>password</label>
//         <input
//           type="password"
//           name="password"
//           value={inputs.password || ""}
//           onChange={(e) => handleInputs(e)}
//         ></input>
//       </div>
//       <div>
//         <input
//           type="checkbox"
//           name="checkbox"
//           value={inputs.checkbox || false}
//           onChange={(e) => handleInputs(e)}
//         ></input>
//         <label>I agree with ...</label>
//       </div>
//       <button onClick={registerFirebase}>Register</button>
//     </>
//   );
// }
