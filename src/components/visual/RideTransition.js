import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const RideElement = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.dark};
`;

export function RideTransition({ effect, setEffect }) {
  const rideTransition = useTransition(effect, {
    from: { x: -100, y: 1000, opacity: 0, transform: "rotate(1turn)" },
    enter: { x: 0, y: -100, opacity: 0.8, transform: "rotate(5.5turn)" },
    leave: { x: 100, y: 1000, opacity: 0, transform: "rotate(9.5turn)" },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {rideTransition((style, item) =>
        item ? <RideElement style={style} /> : <></>
      )}
    </>
  );
}
