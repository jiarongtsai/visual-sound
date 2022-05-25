import styled from "@emotion/styled";

const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  justify-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 90vw;
  margin: 0 auto;
  max-width: 960px;
`;

const VideoWrapper = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: blue;
  overflow: hidden;
  object-position: 50% 50%;
  pointer-events: none;
`;

const CoverImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  cursor: pointer;
`;

export { WorkGrid, VideoWrapper, CoverImage };
