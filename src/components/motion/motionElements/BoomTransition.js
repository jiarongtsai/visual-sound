import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";
const BoomElement = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.dark};
`;

export function BoomTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const boomTransition = useTransition(effect[alphabeta], {
    config: { tension: 150 },
    from: { y: 1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -1000, opacity: 0 },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {boomTransition((style, item) => item && <BoomElement style={style} />)}
    </>
  );
}
BoomTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
