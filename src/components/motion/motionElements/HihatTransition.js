import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";
const hihatArray = ["45%", "50%", "55%"];

const HihatElement = styled(animated.div)`
  position: absolute;
  top: ${(props) => props.top};
  left: 37.5%;
  width: 25%;
  height: 3%;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  background: ${(props) => props.theme.light};
`;

export function HihatTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const hihatTransition = useTransition(effect[alphabeta], {
    config: { tension: 500, friction: 18 },
    from: { x: -300, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 0.8 },
    leave: { x: 300, y: 0, opacity: 0 },
    onRest: () => setEffect(effectCopy),
  });

  return hihatTransition(
    (style, item) =>
      item &&
      hihatArray.map((hihat, i) => (
        <HihatElement key={hihat} style={style} top={hihat} />
      ))
  );
}

HihatTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
