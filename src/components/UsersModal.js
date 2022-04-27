import { useEffect, useState } from "react";

import { ModalBackground } from "./element/ModalBackground";
import { ModalContent } from "./element/ModalContent";
import { Thumbnail } from "./element/Thumbnail";
import { PersonalInfoWrapper } from "./message/MessageList";

export default function UsersModal({
  setOpenModal,
  list,
  invokeFunction,
  buttonName,
}) {
  // const [usersList, setUsersList] = useState([]);

  // useEffect(() => {
  //   setUsersList(list);
  // }, [list]);

  return (
    <ModalBackground>
      <ModalContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexBasis: "50%",
            overflow: "scroll",
          }}
        >
          <div>users</div>
          {list.map((list) => {
            return (
              <div key={list.author_id}>
                <PersonalInfoWrapper>
                  <Thumbnail src={list.author_thumbnail} />
                  <p>{list.author_name}</p>
                </PersonalInfoWrapper>
                <br />
                <button onClick={() => invokeFunction(list.author_id)}>
                  {buttonName}
                </button>
              </div>
            );
          })}
        </div>
        <div>
          <button
            onClick={() => setOpenModal(false)}
            style={{ hegiht: "2rem" }}
          >
            X
          </button>
        </div>
      </ModalContent>
    </ModalBackground>
  );
}
