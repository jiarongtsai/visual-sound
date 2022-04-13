import { React, useState } from "react";
import styled from "styled-components";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import db from "../utils/firebase-config";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;
const ModalCover = styled.div`
  position: fixed;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  z-index: 990;
  background-color: white;
  width: 50vw;
  height: 50vh;
`;

const ModalText = styled.p`
  z-index: 999;
  margin-top: 10vh;
`;

const ModalCloseButton = styled.button`
  z-index: 999;
  background-color: red;
  width: 10vw;
  height: 5vh;
`;

const ModalConfirmButton = styled.button`
  z-index: 999;
  background-color: green;
  width: 10vw;
  height: 5vh;
`;

export default function Modal({ setOpenModal }) {
  const [inputs, setInputs] = useState({});

  function handleInputs(e) {
    setInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  async function uploadtoFirebase() {
    const data = {
      author_id: "oWhlyRTSEMPFknaRnA5MNNB8iZC2",
      description: inputs.description,
      comments_count: 0,
      image_url: "",
      video_url: "",
      created_time: Timestamp.fromDate(new Date(Date.now())),
      tags: [],
      collected_by: [],
      liked_by: [],
      // cannot store array of array in firestore
      // sheetmusic: [[], [], [], []],
    };

    const docRef = await addDoc(collection(db, "works"), data);
    console.log(docRef.id);
  }

  return (
    <ModalCover>
      <ModalContent>
        <ModalText>Modal</ModalText>
        <Div>
          <label>description</label>
          <textarea
            name="description"
            value={inputs.description || ""}
            onChange={handleInputs}
          />
        </Div>
        <Div>
          <label>tags</label>
          <input
            name="tags"
            value={inputs.tags || []}
            onChange={handleInputs}
          />
        </Div>
        <div>
          <ModalConfirmButton onClick={uploadtoFirebase}>
            upload
          </ModalConfirmButton>
          <ModalCloseButton
            onClick={() => {
              setOpenModal(false);
            }}
          >
            close
          </ModalCloseButton>
        </div>
      </ModalContent>
    </ModalCover>
  );
}
