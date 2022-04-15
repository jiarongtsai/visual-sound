import { React, useState } from "react";
import styled from "styled-components";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import db from "../utils/firebase-config";

console.clear();
const UserID = "oWhlyRTSEMPFknaRnA5MNNB8iZC2";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;
const ModalCover = styled.div`
  top: 0;
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
  margin-top: 5vh;
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

const TagsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const TagWrapper = styled.div`
  background-color: gray;
  color: white;
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  margin: 0.5rem;
  display: flex;
`;

const TagDelete = styled.span`
  margin-left: 0.5em;
  cursor: pointer;
`;

export default function UploadModal({ setOpenModal, sequenceJSON, bpm }) {
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  function handleInputs(e) {
    setInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  }

  function handleTagInput(e) {
    const { key } = e;
    const trimmedInput = tagInput.trim();

    if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags([...tags, trimmedInput]);
      setTagInput("");
    }
  }

  function deleteTag(value) {
    setTags(tags.filter((tag) => tag != value));
  }

  async function uploadtoFirebase() {
    const data = {
      author_id: UserID,
      description: inputs.description,
      comments_count: 0,
      image_url: "",
      video_url: "",
      created_time: Timestamp.fromDate(new Date(Date.now())),
      tags: tags,
      collected_by: [],
      liked_by: [],
      sheetmusic: sequenceJSON,
      bpm: bpm,
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
          <p>Tag your post, and separeted by comma</p>
          <input
            name="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => handleTagInput(e)}
            placeholder="Add tags..."
          />
          <TagsContainer>
            {tags.map((tag) => (
              <TagWrapper key={tag}>
                {tag}
                <TagDelete onClick={() => deleteTag(tag)}>X</TagDelete>
              </TagWrapper>
            ))}
          </TagsContainer>
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
