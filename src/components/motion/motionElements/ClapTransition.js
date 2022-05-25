import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";

// const Password = styled(Input).attrs({ type: "password" })`
//   color: blue;
// `;
// const MyComponent = (props) => (
//   <input
//     type="checkbox"
//     css={{
//       height: 40,
//       width: 40,
//       color: "green",
//     }}
//     {...props}
//   />
// );

const ClapElementRandom = styled(animated.div)// }, //   left: props.position, // style: { // .attrs((props) => ({
// }))
`
left: props.position
  position: absolute;
  top: 0;
  width: 4px;
  height: 100%;
  background: ${(props) => props.theme.special};
`;

export function ClapTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const clapTransition = useTransition(effect[alphabeta], {
    config: { mass: 1, tension: 500, friction: 18 },
    from: {
      x: -1000,
      y: -100,
      opacity: 0,
      transform: "rotate(1turn)",
      freq: "0.0, 0.0",
    },
    enter: {
      x: 0,
      y: 0,
      opacity: 0.7,
      transform: "rotate(3.5turn)",
      freq: "0.1, 0.0",
    },
    leave: {
      x: 1000,
      y: -100,
      opacity: 0,
      transform: "rotate(1turn)",
      freq: "0.0, 0.0",
    },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {clapTransition(
        (style, item) =>
          item && (
            <ClapElementRandom
              style={style}
              position={Math.ceil(Math.random() * 100) + "%"}
            />
          )
      )}
    </>
  );
}
ClapTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
