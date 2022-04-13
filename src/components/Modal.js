import { React } from "react";
import styled from "styled-components";

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
  height: 20vh;
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

export default function Modal(props) {
  return (
    <ModalCover>
      <ModalContent>
        <ModalText>Modal</ModalText>
        <ModalConfirmButton>upload</ModalConfirmButton>
        <ModalCloseButton
          onClick={() => {
            props.setUpload((v) => !v);
          }}
        >
          close
        </ModalCloseButton>
      </ModalContent>
    </ModalCover>
  );
}
