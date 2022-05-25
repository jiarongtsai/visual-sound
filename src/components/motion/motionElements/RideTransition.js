import styled from "@emotion/styled";
import { animated } from "react-spring";
import { useTransition } from "react-spring";
import PropTypes from "prop-types";
const rideVariant = [
  { positionx: "10%" },
  { positionx: "20%" },
  { positionx: "40%" },
  { positionx: "75%" },
];

const RideElement = styled(animated.div)`
  position: absolute;
  left: props.position;
  top: ${(props) => props.positionx};
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid ${(props) => props.theme.medium};
`;

export function RideTransition({ alphabeta, effect, setEffect }) {
  const effectCopy = { ...effect };
  effectCopy[alphabeta] = false;
  const rideTransition = useTransition(effect[alphabeta], {
    config: { velocity: 0.1 },
    from: { x: -1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 1000, opacity: 0, transform: "rotate(9.5turn)" },
    onRest: () => setEffect(effectCopy),
  });

  return (
    <>
      {rideTransition(
        (style, item) =>
          item &&
          rideVariant.map((ride) => (
            <RideElement
              key={ride.positionx}
              style={style}
              positionx={ride.positionx}
              positiony={Math.ceil(Math.random() * 100) + "%"}
            />
          ))
      )}
    </>
  );
}

RideTransition.propTypes = {
  alphabeta: PropTypes.string,
  effect: PropTypes.object,
  setEffect: PropTypes.func,
};
