import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";
import { ModalBackground } from "./element/ModalBackground";
import { ModalContent } from "./element/ModalContent";

const ModalCloseButton = styled.button`
  flex-basis: 5%;
  background-color: red;
  height: 2rem;
  cursor: pointer;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;

const Img = styled.img`
  width: 100px;
  border-radius: 50%;
`;

export default function EditProfileModal({
  profile,
  setOpenModal,
  setProfile,
}) {
  const user = useContext(AuthContext);
  const [inputs, setInputs] = useState({});

  function handleInputs(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  async function handelUpdate() {
    const imageUrl = await Firebase.uploadFile(
      inputs.user_thumbnail,
      "thumbnails"
    );
    await Firebase.updateProfile(
      user,
      inputs.user_name,
      inputs.user_bio,
      imageUrl
    );
    setProfile((pre) => ({
      ...pre,
      user_bio: inputs.user_bio,
      user_name: inputs.user_name,
      user_thumbnail: imageUrl,
    }));
    setInputs({});
    setOpenModal(false);
  }

  return (
    <ModalBackground>
      <ModalContent>
        <div>
          <Div>
            <Img src={profile.user_thumbnail} />
            <input
              name="user_thumbnail"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) =>
                setInputs({ ...inputs, user_thumbnail: e.target.files[0] })
              }
            />
          </Div>
          <Div>
            <label>username</label>
            <input
              name="user_name"
              placeholder={profile.user_name}
              value={inputs.user_name || ""}
              onChange={(e) => handleInputs(e)}
            ></input>
          </Div>
          <Div>
            <label>bio</label>
            <textarea
              name="user_bio"
              rows="5"
              cols="50"
              placeholder={profile.user_bio}
              value={inputs.user_bio || ""}
              onChange={handleInputs}
            />
          </Div>
          <button onClick={handelUpdate}>update</button>
        </div>
        <ModalCloseButton onClick={() => setOpenModal(false)}>
          X
        </ModalCloseButton>
      </ModalContent>
    </ModalBackground>
  );
}
