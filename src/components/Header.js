import { React } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 50vw;
  margin: 0 auto;
`;

export default function Header() {
  return (
    <>
      <h1>Visual Sound - personal project</h1>
      <Nav>
        <Link to="/">Main</Link>
        <Link to="/community">Community</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">Profile</Link>
      </Nav>
    </>
  );
}
