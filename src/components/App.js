import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../components/auth/Auth";
import { theme } from "../theme/theme";
import RequireAuth from "../components/auth/RequireAuth";
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
import Navbar from "./Navbar";

function App() {
  const location = useLocation();
  const state = location.state;
  const [follwingWorks, setFollowingworks] = useState([]);
  const [likes, setLikes] = useState([]);
  const [collections, setCollections] = useState([]);

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Main />} />
            <Route
              path="community"
              element={
                <RequireAuth>
                  <Community
                    follwingWorks={follwingWorks}
                    setFollowingworks={setFollowingworks}
                    likes={likes}
                    setLikes={setLikes}
                    collections={collections}
                    setCollections={setCollections}
                  />
                </RequireAuth>
              }
            />
            <Route path="explore" element={<Explore />} />
            <Route path="/work/:id" element={<WorkView />} />

            <Route path="/user/:uid" element={<User />} />

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
            <Route
              path="message/:mid"
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
            <Route
              path="/work/:id"
              element={
                <WorkModal
                  follwingWorks={follwingWorks}
                  likes={likes}
                  setLikes={setLikes}
                  collections={collections}
                  setCollections={setCollections}
                />
              }
            />
          </Routes>
        )}
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
