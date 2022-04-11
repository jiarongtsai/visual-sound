import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Explore from "../pages/Explore";

function App() {
  return (
    <div>
      <p>Visual Sound - personal project</p>
      <nav>
        <Link to="/">Main</Link>
        <Link to="/community">Community</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">Profile</Link>
      </nav>
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
