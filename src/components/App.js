import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Header from "./Header";
import Main from "../pages/Main";
import Profile from "../pages/Profile";
import Community from "../pages/Community";
import Explore from "../pages/Explore";
import User from "../pages/User";
import WorkModal from "./WorkModal";
import WorkView from "../pages/WorkView";
import NotFound from "../pages/NotFound";

function App() {
  let location = useLocation();
  let state = location.state;
  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Header />}>
          <Route index element={<Main />} />
          <Route path="profile" element={<Profile />} />
          <Route path="community" element={<Community />} />
          <Route path="explore" element={<Explore />} />
          <Route path="/work/:id" element={<WorkView />} />
          <Route path="/user/:invoiceId" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/work/:id" element={<WorkModal />} />{" "}
        </Routes>
      )}
    </>
  );
}

export default App;
