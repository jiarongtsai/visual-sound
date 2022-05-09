import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const HihatElement = styled(animated.div)`
  position: absolute;
  top: 45%;
  left: 37.5%;
  width: 25%;
  height: 10%;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  background: ${(props) => props.theme.light};
`;

export function HihatTransition({ effect, setEffect }) {
  const hihatTransition = useTransition(effect, {
    config: { tension: 500, friction: 18 },
    from: { x: -300, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 0.8 },
    leave: { x: 300, y: 0, opacity: 0 },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {hihatTransition((style, item) =>
        item ? <HihatElement style={style} /> : <></>
      )}
    </>
  );
}
