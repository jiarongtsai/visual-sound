import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";
const OpenhatElement = styled(animated.div)`
  position: absolute;
  top: ${(props) => props.position};
  left: ${(props) => props.position};
  width: 2.5vw;
  height: 2.5vw;
  border: 0.5px solid ${(props) => props.theme.light};
  border-radius: 50%;
`;

export function OpenhatTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const [openhatVariant, setOpenhatVariant] = useState([]);

  useEffect(() => {
    if (!effect) return;
    setOpenhatVariant([
      Math.ceil(Math.random() * 50) + 20 + "%",
      Math.ceil(Math.random() * 50) + 20 + "%",
      Math.ceil(Math.random() * 50) + 20 + "%",
      Math.ceil(Math.random() * 50) + 20 + "%",
      Math.ceil(Math.random() * 50) + 20 + "%",
    ]);
  }, [effect]);

  const openhatTransition = useTransition(effect[alphabeta], {
    config: { tension: 100, velocity: 0.1 },
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    onRest: () => setEffect(effectCopy),
  });
  const openhatTransitionDelay = useTransition(effect[alphabeta], {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 2.5 },
    leave: { opacity: 0, scale: 0 },
    delay: 100,

    onRest: () => setEffect(effectCopy),
  });
  const openhatTransitionDoubleDelay = useTransition(effect[alphabeta], {
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 5 },
    leave: { opacity: 0, scale: 0 },
    delay: 300,

    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {openhatTransition((style, item) =>
        item
          ? openhatVariant.map((element, i) => (
              <OpenhatElement key={i} position={element} style={style} />
            ))
          : ""
      )}
      {openhatTransitionDelay((style, item) =>
        item
          ? openhatVariant.map((element, i) => (
              <OpenhatElement key={i} position={element} style={style} />
            ))
          : ""
      )}
      {openhatTransitionDoubleDelay((style, item) =>
        item
          ? openhatVariant.map((element, i) => (
              <OpenhatElement key={i} position={element} style={style} />
            ))
          : ""
      )}
    </>
  );
}

OpenhatTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
