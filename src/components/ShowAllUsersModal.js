import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "./auth/Auth";
import { ModalBackground } from "./element/ModalBackground";
import { ModalContent } from "./element/ModalContent";
import { Thumbnail } from "./element/Thumbnail";
import { PersonalInfoWrapper } from "./message/MessageList";

export default function ShowAllUsersModal({ setShowModal, messageList }) {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);

  function listFilter(uid, list) {
    const idList = list.map((item) => item.author_id);
    idList.push(uid);
    return idList;
  }

  useEffect(() => {
    const filterlist = listFilter(user.uid, messageList);
    Firebase.getAllUsers(filterlist).then((data) => {
      setUsersList(data);
    });
  }, []);

  function openNewChat(id1, id2) {
    Firebase.addNewChatroom(id1, id2).then((mid) => {
      navigate(`/message/${mid}`);
      setShowModal(false);
    });
  }
  return (
    <ModalBackground>
      <ModalContent>
        <div
          style={{ display: "flex", flexDirection: "column", flexBasis: "50%" }}
        >
          <div>users</div>
          {usersList.map((list) => {
            return (
              <div key={list.uid}>
                <PersonalInfoWrapper
                  onClick={() => openNewChat(list.uid, user.uid)}
                  style={{ cursor: "pointer" }}
                >
                  <Thumbnail src={list.user_thumbnail} />
                  <p>{list.user_name}</p>
                </PersonalInfoWrapper>
                <br />
              </div>
            );
          })}
        </div>
        <div>
          <button
            onClick={() => setShowModal(false)}
            style={{ hegiht: "2rem" }}
          >
            X
          </button>
        </div>
      </ModalContent>
    </ModalBackground>
  );
}
