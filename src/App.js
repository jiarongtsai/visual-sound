import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth";
import Main from "./pages/Main";
import Profile from "./pages/profile/Profile";
import ProfileWorks from "./pages/profile/ProfileWorks";
import ProfileCollections from "./pages/profile/ProfileCollections";
import Message from "./pages/message/Message";
import Community from "./pages/community/Community";
import Explore from "./pages/Explore";
import User from "./pages/User";
import WorkModal from "./pages/work/WorkModal";
import WorkView from "./pages/work/WorkView";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  const state = location.state;
  const [followingWorks, setFollowingWorks] = useState([]);

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Main />} />
          <Route
            path="community"
            element={
              <RequireAuth>
                <Community
                  followingWorks={followingWorks}
                  setFollowingWorks={setFollowingWorks}
                />
              </RequireAuth>
            }
          />
          <Route path="explore" element={<Explore />} />
          <Route
            path="/work/:id"
            element={
              <WorkView
                followingWorks={followingWorks}
                setFollowingWorks={setFollowingWorks}
              />
            }
          />

          <Route path="/user/:uid" element={<User />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
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
                followingWorks={followingWorks}
                setFollowingWorks={setFollowingWorks}
              />
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
