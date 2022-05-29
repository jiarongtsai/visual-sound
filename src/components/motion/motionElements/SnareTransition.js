import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";

const SnareElement = styled(animated.div)`
  top: ${(props) => props.random.x};
  left: ${(props) => props.random.y};
  position: absolute;
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background: ${(props) => props.theme.special};
`;

export function SnareTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const [random, setrandom] = useState([]);

  useEffect(() => {
    if (!effect[alphabeta]) return;
    setrandom([
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
      {
        x: Math.ceil(Math.random() * 50) + 20 + "%",
        y: Math.ceil(Math.random() * 50) + 20 + "%",
      },
    ]);
  }, [effect]);

  const snareTransition = useTransition(effect[alphabeta], {
    config: { velocity: 0.01 },
    from: { opacity: 0, scale: 0.1 },
    enter: { opacity: 1, scale: 0.1 },
    leave: { opacity: 0, scale: 0.1 },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {snareTransition(
        (style, item) =>
          item &&
          random.map((particle, i) => (
            <SnareElement key={i} style={style} random={particle} />
          ))
      )}
    </>
  );
}
SnareTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
