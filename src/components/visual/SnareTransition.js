import { useState, useEffect } from "react";
import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const SnareElement = styled(animated.div)`
  position: absolute;
  top: ${(props) => props.random.x};
  left: ${(props) => props.random.y};
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background: ${(props) => props.theme.special};
`;

export function SnareTransition({ effect, setEffect }) {
  const [random, setrandom] = useState([]);

  useEffect(() => {
    if (!effect) return;
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

  const snareTransition = useTransition(effect, {
    config: { velocity: 0.01 },
    from: { opacity: 0, scale: 0.1 },
    enter: { opacity: 1, scale: 0.1 },
    leave: { opacity: 0, scale: 0.1 },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {snareTransition((style, item) =>
        item ? (
          random.map((particle, i) => (
            <SnareElement key={i} style={style} random={particle} />
          ))
        ) : (
          <></>
        )
      )}
    </>
  );
}
