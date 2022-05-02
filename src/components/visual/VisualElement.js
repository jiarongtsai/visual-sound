import styled from "styled-components";
import { animated } from "react-spring";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: ${(props) => props.theme.background};
`;

const Square = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: ${(props) => props.theme.medium};
  border-radius: 10%;
`;

const Ellipse = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: ${(props) => props.theme.dark};
  border-radius: 50%;
`;

const Triangle = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid ${(props) => props.theme.light};
`;

export { Wrapper, Square, Ellipse, Triangle };
