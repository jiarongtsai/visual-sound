import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { Thumbnail } from "../components/element/Thumbnail";
import { AuthContext } from "../components/auth/Auth";
import UsersModal from "../components/UsersModal";

const Nav = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
export default function ProfileLayout() {
  const [profile, setProfile] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState([]);
  const [invokeFunction, setInvokeFunction] = useState({});
  const [buttonName, setButtonName] = useState("");
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    Firebase.getProfile(user.uid).then((data) => setProfile(data));
  }, []);

  const unfollow = async (userID) => {
    console.log("unfollow");
    await Firebase.unfollowUser(user.uid, userID, profile.following);
    setList((pre) => pre.filter((user) => user.author_id !== userID));
  };

  const chat = async (userID) => {
    const mid = await Firebase.getChatroom(user.uid, userID);
    navigate(`/message/${mid}`);
  };

  async function openFollowers() {
    setOpenModal(true);
    const FollowerListWithInfo = await Promise.all(
      profile.followers.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );

    setList(() => FollowerListWithInfo);
    setInvokeFunction(() => chat);
    setButtonName("chat");
  }

  async function openFollowing() {
    setOpenModal(true);
    const FollowingListWithInfo = await Promise.all(
      profile.following.map(async (id) => {
        const data = await Firebase.getUserBasicInfo(id);
        return data;
      })
    );
    setList(() => FollowingListWithInfo);
    setInvokeFunction(() => unfollow);
    setButtonName("unfollow");
  }

  return (
    <>
      {openModal ? (
        <UsersModal
          setOpenModal={setOpenModal}
          list={list}
          invokeFunction={invokeFunction}
          buttonName={buttonName}
        />
      ) : (
        ""
      )}
      <div>
        <Thumbnail src={profile.user_thumbnail} />
        <p>{profile.user_name}</p>
        <p>{profile.user_bio}</p>
        <button>edit profile</button>
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
