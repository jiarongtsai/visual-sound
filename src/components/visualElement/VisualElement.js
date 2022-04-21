import styled from "styled-components";
import { animated } from "react-spring";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 65vw;
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

const themeDefault = {
  background: "white",
  light: "green",
  medium: "orange",
  dark: "tomato",
  special: "teal",
};
const energe = {
  background: "#219EBC",
  light: "#FFB703",
  medium: "#FB8500",
  dark: "#023047",
  special: "#8ECAE6",
};
const macaroon = {
  background: "#D6EADF",
  light: "#EAC4D5",
  medium: "#B8E0D2",
  dark: "#809BCE",
  special: "#95B8D1",
};
const neon = {
  background: "#3A0CA3",
  light: "#F72585",
  medium: "#B5179E",
  dark: "#0CECDD",
  special: "#4895EF",
};
const vintage = {
  background: "#125B50",
  light: "#FAF5E4",
  medium: "#F8B400",
  dark: "#FF6363",
  special: "#FF8C32",
};

export {
  Wrapper,
  Square,
  Ellipse,
  Triangle,
  themeDefault,
  energe,
  macaroon,
  neon,
  vintage,
};
