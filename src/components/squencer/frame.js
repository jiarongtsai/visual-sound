import styled from "styled-components";

const Frame = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  width: 100%;
  height: 36vh;
  @media (min-width: 768px) {
    width: 70%;
  }
`;

export default Frame;
