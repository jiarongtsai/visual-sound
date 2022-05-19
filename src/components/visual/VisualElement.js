import styled from "styled-components";

export const Wrapper = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: ${(props) => props.theme.background};
`;
