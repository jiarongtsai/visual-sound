import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

const SnareElement = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.dark};
`;

export function SnareTransition({ effect, setEffect }) {
  const snareTransition = useTransition(effect, {
    config: { tension: 150 },
    from: { y: 1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -1000, opacity: 0 },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {snareTransition((style, item) =>
        item ? <SnareElement style={style} /> : <></>
      )}
    </>
  );
}
