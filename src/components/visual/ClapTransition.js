import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const ClapElementRandom = styled(animated.div).attrs((props) => ({
  style: {
    left: props.position,
  },
}))`
  position: absolute;
  top: 0;
  width: 4px;
  height: 100%;
  background: ${(props) => props.theme.special};
`;

export function ClapTransition({ effect, setEffect }) {
  const clapTransition = useTransition(effect, {
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
    onRest: () => setEffect(false),
  });

  return (
    <>
      {clapTransition((style, item) =>
        item ? (
          <ClapElementRandom
            style={style}
            position={Math.ceil(Math.random() * 100) + "%"}
          />
        ) : (
          ""
        )
      )}
    </>
  );
}
