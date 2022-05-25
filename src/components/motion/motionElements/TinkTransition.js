import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";

const TinkElement = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1adpx;
  background: ${(props) => props.theme.medium};
`;

const TinkElementAnother = styled(animated.div)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: ${(props) => props.theme.medium};
`;

export function TinkTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const tinkTransition = useTransition(effect[alphabeta], {
    config: { tension: 150 },
    from: {
      y: 0,
      opacity: 0,
      scale: 0,
      transform: `rotate(${Math.ceil(Math.random() * 400)}deg)`,
    },
    enter: { y: 0, opacity: 1, scale: 2 },
    leave: { y: 0, opacity: 0, scale: 0 },
    onRest: () => setEffect(effectCopy),
  });

  const tinkTransitionLeft = useTransition(effect[alphabeta], {
    config: { tension: 150 },
    from: {
      x: -200,
      opacity: 0,
      scale: 0,
      transform: `rotate(${-Math.ceil(Math.random() * 400)}deg)`,
    },
    enter: { y: 0, opacity: 1, scale: 2 },
    leave: { y: 0, opacity: 0, scale: 0 },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {tinkTransition(
        (style, item) =>
          item && (
            <>
              <TinkElement style={style} />
              <TinkElementAnother style={style} />
            </>
          )
      )}
      {tinkTransitionLeft(
        (style, item) =>
          item && (
            <>
              <TinkElement style={style} />
              <TinkElementAnother style={style} />
            </>
          )
      )}
    </>
  );
}

TinkTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
