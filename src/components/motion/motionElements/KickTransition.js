import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";

const KickElement = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
  background: ${(props) => props.theme.medium};
`;

const KickElementReverse = styled(animated.div)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
  background: ${(props) => props.theme.medium};
`;

export function KickTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const kickTransition = useTransition(effect[alphabeta], {
    config: { tension: 150 },
    from: { y: 1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -1000, opacity: 0 },
    onRest: () => setEffect(effectCopy),
  });

  const kickTransitionReverse = useTransition(effect[alphabeta], {
    config: { tension: 150 },
    from: { y: -1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 1000, opacity: 0 },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {kickTransition((style, item) => item && <KickElement style={style} />)}
      {kickTransitionReverse(
        (style, item) => item && <KickElementReverse style={style} />
      )}
    </>
  );
}

KickTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
