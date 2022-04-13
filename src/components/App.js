import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { GlobalStyles } from "../global";
import styled from "styled-components";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Explore from "../pages/Explore";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 50vw;
`;

function App() {
  return (
    <div>
      <GlobalStyles />
      <p>Visual Sound - personal project</p>
      <Nav>
        <Link to="/">Main</Link>
        <Link to="/community">Community</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">Profile</Link>
      </Nav>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="profile" element={<Profile />} />
        <Route path="community" element={<Community />} />
        <Route path="explore" element={<Explore />} />
      </Routes>
    </div>
  );
}

export default App;
