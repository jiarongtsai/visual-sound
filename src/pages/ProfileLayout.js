import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
import { AuthContext } from "../components/auth/Auth";
import UsersModal from "../components/UsersModal";
import EditProfileModal from "../components/EditProfileModal";
import { useDisclosure } from "@chakra-ui/react";
const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
export default function ProfileLayout() {
  const [profile, setProfile] = useState({});
  const [action, setAction] = useState({});

  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    Firebase.getProfile(user.uid).then((data) => setProfile(data));
  }, []);

  const unfollow = async (userID) => {
    await Firebase.unfollowUser(user.uid, userID, profile.following);
    setAction((pre) => ({
      ...pre,
      userList: pre.userList.filter((user) => user.author_id !== userID),
    }));
  };

  const chat = async (userID) => {
    const mid = await Firebase.getChatroom(user.uid, userID);
    navigate(`/message/${mid}`);
  };

  async function openFollowers() {
    const FollowerListWithInfo = await Promise.all(
      profile.followers.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );
    setAction({
      name: "Follower List",
      userList: FollowerListWithInfo,
      invokeFunction: chat,
      buttonText: "Send Message",
    });
    onOpen();
  }

  async function openFollowing() {
    const FollowingListWithInfo = await Promise.all(
      profile.following.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );
    setAction({
      name: "Following List",
      userList: FollowingListWithInfo,
      invokeFunction: unfollow,
      buttonText: "Unfollow",
    });
    onOpen();
  }

  return (
    <>
      <UsersModal isOpen={isOpen} onClose={onClose} action={action} />

      {openEditModal ? (
        <EditProfileModal
          setOpenModal={setOpenEditModal}
          profile={profile}
          setProfile={setProfile}
        />
      ) : (
        ""
      )}
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
        <button onClick={() => setOpenEditModal(true)}>edit profile</button>
      </div>
      <Nav>
        <div onClick={openFollowers} style={{ cursor: "pointer" }}>
          followers {profile.followers?.length || 0}
        </div>
        <div onClick={openFollowing} style={{ cursor: "pointer" }}>
          following {profile.following?.length || 0}
        </div>
      </Nav>
      <hr />
      <Nav>
        <Link to="">Work</Link>
        <Link to="collection">Collection</Link>
      </Nav>
      <Outlet />
    </>
  );
}
