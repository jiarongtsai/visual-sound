import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Firebase } from "../utils/firebase";
import { AuthContext } from "../components/auth/Auth";

const Div = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
`;
const ModalBackground = styled.div`
  top: 0;
  left: 0;
  position: fixed;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalWhitebroad = styled.div`
  background-color: white;
  display: flex;
  justify-content: space-between;
  width: 70vw;
  height: 70vh;
  padding: 1rem 2rem;
  overflow: scroll;
`;

const ModalText = styled.p`
  z-index: 999;
  margin-top: 5vh;
`;

const ModalCloseButton = styled.button`
  z-index: 999;
  background-color: red;
  width: 5vw;
  height: 5vh;
  flex-basis: 50px;
`;

const ModalConfirmButton = styled.button`
  z-index: 999;
  background-color: green;
  width: 10vw;
  height: 5vh;
  margin-bottom: 2rem;
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

export default function UploadModal({
  setOpenModal,
  sequenceJSON,
  bpm,
  setIsUploaded,
  image,
  setImage,
  themeColor,
}) {
  const user = useContext(AuthContext);
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
    const workRef = Firebase.getNewWorkRef();
    const workID = workRef.id;

    const blob = await (await fetch(image)).blob();
    const workFile = new File([blob], `${user.uid}_${workID}.png`, {
      type: "image/png",
    });

    const imageUrl = await Firebase.uploadFile(workFile, "images");

    const data = {
      author_id: user.uid,
      description: inputs.description,
      comments_count: 0,
      image_url: imageUrl,
      tags: tags,
      collected_by: [],
      liked_by: [],
      sheetmusic: sequenceJSON,
      bpm: bpm,
      themeColor: themeColor,
    };

    Firebase.addNewWork(workRef, data).then(() => {
      Firebase.updateTags(tags).then(() => {
        setInputs({});
        setTags([]);
        setTagInput("");
        setOpenModal(false);
        setIsUploaded(true);
        setImage(null);
      });
    });
  }

  if (!user) return null;
  return (
    <>
      <ModalBackground>
        <ModalWhitebroad>
          <div>
            <ModalText>Modal</ModalText>
            {image && <img src={image} style={{ width: "50vw" }} />}
            <Div>
              <label>description</label>
              <textarea
                name="description"
                rows="5"
                cols="50"
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
            <ModalConfirmButton onClick={uploadtoFirebase}>
              upload
            </ModalConfirmButton>
          </div>
          <ModalCloseButton
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </ModalCloseButton>
        </ModalWhitebroad>
      </ModalBackground>
    </>
  );
}
