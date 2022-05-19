import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const rideVariant = [
  { positionx: "10%" },
  { positionx: "20%" },
  { positionx: "40%" },
  { positionx: "75%" },
];

const RideElement = styled(animated.div)`
  position: absolute;
  top: ${(props) => props.positionx};
  left: ${(props) => props.positiony};
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid ${(props) => props.theme.medium};
  ${"" /* border-top: 25px solid ${(props) => props.theme.special}; */}
`;

export function RideTransition({ effect, setEffect }) {
  const rideTransition = useTransition(effect, {
    config: { velocity: 0.1 },
    from: { x: -1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 1000, opacity: 0, transform: "rotate(9.5turn)" },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {rideTransition((style, item) =>
        item
          ? rideVariant.map((ride) => (
              <RideElement
                key={ride.positionx}
                style={style}
                positionx={ride.positionx}
                positiony={Math.ceil(Math.random() * 100) + "%"}
              />
            ))
          : ""
      )}
    </>
  );
}
