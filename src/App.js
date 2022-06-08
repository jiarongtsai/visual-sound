import React, { useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import RequireAuth from "./components/auth/RequireAuth";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
const Profile = lazy(() => import("./pages/profile/Profile"));
const ProfileWorks = lazy(() => import("./pages/profile/ProfileWorks"));
const ProfileCollections = lazy(() =>
  import("./pages/profile/ProfileCollections")
);
const Message = lazy(() => import("./pages/message/Message"));
const Community = lazy(() => import("./pages/community/Community"));
const WorkModal = lazy(() => import("./pages/work/WorkModal"));
const WorkView = lazy(() => import("./pages/work/WorkView"));
const User = lazy(() => import("./pages/User"));

function App() {
  const location = useLocation();
  const state = location.state;
  const [followingWorks, setFollowingWorks] = useState([]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Main />} />
            <Route path="explore" element={<Explore />} />
            <Route path="login" element={<Login />} />

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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
      {state?.backgroundLocation && (
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      )}
    </>
  );
}

export default App;
