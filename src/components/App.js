import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../auth/Auth";
import RequireAuth from "../auth/RequireAuth";
import Header from "./Header";
import Main from "../pages/Main";
import ProfileLayout from "../pages/ProfileLayout";
import ProfileWorks from "../pages/ProfileWorks";
import ProfileCollections from "../pages/ProfileCollections";
import Message from "../pages/Message";
import Community from "../pages/Community";
import Explore from "../pages/Explore";
import User from "../pages/User";
import WorkModal from "./WorkModal";
import WorkView from "../pages/WorkView";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

function App() {
  const location = useLocation();
  const state = location.state;
  return (
    <AuthProvider>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Header />}>
          <Route index element={<Main />} />
          <Route
            path="community"
            element={
              <RequireAuth>
                <Community />
              </RequireAuth>
            }
          />
          <Route path="explore" element={<Explore />} />
          <Route path="/work/:id" element={<WorkView />} />
          <Route path="/user/:id" element={<User />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <ProfileLayout />
              </RequireAuth>
            }
          >
            <Route index element={<ProfileWorks />} />
            <Route path="collection" element={<ProfileCollections />} />
          </Route>
          <Route
            path="message"
            element={
              <RequireAuth>
                <Message />
              </RequireAuth>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/work/:id" element={<WorkModal />} />
        </Routes>
      )}
    </AuthProvider>
  );
}

export default App;
