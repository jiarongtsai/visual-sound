import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth";
import Main from "./routes/Main";
import ProfileLayout from "./routes/profile/ProfileLayout";
import ProfileWorks from "./routes/profile/ProfileWorks";
import ProfileCollections from "./routes/profile/ProfileCollections";
import Message from "./routes/message/Message";
import Community from "./routes/community/Community";
import Explore from "./routes/Explore";
import User from "./routes/User";
import WorkModal from "./routes/work/WorkModal";
import WorkView from "./routes/work/WorkView";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import Create from "./routes/create/Create";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();
  const state = location.state;
  const [followingWorks, setFollowingWorks] = useState([]);

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Navbar />}>
          <Route path="create" element={<Create />} />
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
