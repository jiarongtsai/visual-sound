import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./Header";
import Main from "../pages/Main";
import ProfileLayout from "../pages/ProfileLayout";
import ProfileWorks from "../pages/ProfileWorks";
import ProfileCollections from "../pages/ProfileCollections";
import Community from "../pages/Community";
import Explore from "../pages/Explore";
import User from "../pages/User";
import WorkModal from "./WorkModal";
import WorkView from "../pages/WorkView";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { Firebase } from "../utils/firebase";

Firebase.authStatus();

function App() {
  let location = useLocation();
  let state = location.state;
  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Header />}>
          <Route index element={<Main />} />
          <Route path="community" element={<Community />} />
          <Route path="explore" element={<Explore />} />
          <Route path="login" element={<Login />} />
          <Route path="/work/:id" element={<WorkView />} />
          <Route path="/user/:invoiceId" element={<User />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route index element={<ProfileWorks />} />
            <Route path="collection" element={<ProfileCollections />} />
          </Route>
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
