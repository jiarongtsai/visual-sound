import { useEffect, useState } from "react";
import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";

const TomElement = styled(animated.div)`
  position: absolute;
  top: ${(props) => props.random};
  left: ${(props) => props.random};
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  background: ${(props) => props.theme.dark};
`;

export function TomTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const [random, setrandom] = useState(0);

  useEffect(() => {
    if (!effect) return;
    setrandom(Math.ceil(Math.random() * 50) + 20 + "%");
  }, [effect]);

  const tomTransition = useTransition(effect[alphabeta], {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 0.9, scale: 1.5 },
    leave: { opacity: 0, scale: 0 },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {tomTransition(
        (style, item) => item && <TomElement style={style} random={random} />
      )}
    </>
  );
}

TomTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
