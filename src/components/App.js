import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Explore from "../pages/Explore";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="profile" element={<Profile />} />
        <Route path="community" element={<Community />} />
        <Route path="explore" element={<Explore />} />
      </Routes>
    </>
  );
}

export default App;
