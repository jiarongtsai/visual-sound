import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const OpenhatElement = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: ${(props) => props.theme.dark};
  border-radius: 50%;
`;

export function OpenhatTransition({ effect, setEffect }) {
  const openhatTransition = useTransition(effect, {
    config: { tension: 150 },
    from: { y: 1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -1000, opacity: 0 },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {openhatTransition((style, item) =>
        item ? <OpenhatElement style={style} /> : <></>
      )}
    </>
  );
}
