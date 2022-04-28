import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";
import AuthStatus from "../components/auth/AuthStatus";
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 50vw;
  margin: 0 auto;
`;

export default function Header() {
  return (
    <>
      <Flex
        bg="#8547D6"
        as="header"
        position="fixed"
        w="100%"
        p={4}
        color="white"
        mb="25"
      >
        <Link to="/">Main</Link>
        <Link to="/community">Community</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/message">Message</Link>
        <AuthStatus />
      </Flex>
      <Outlet />
    </>
  );
}
