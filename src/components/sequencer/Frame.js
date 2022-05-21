import styled from "styled-components";

const Frame = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, minmax(15px, 1fr));
  grid-template-rows: repeat(${(props) => props.rows}, minmax(40px, 1fr));
  width: 100%;
`;

export default Frame;
