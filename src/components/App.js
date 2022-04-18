import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Explore from "../pages/Explore";
import NotFound from "../pages/NotFound";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="profile" element={<Profile />} />
        <Route path="community" element={<Community />} />
        <Route path="explore" element={<Explore />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
