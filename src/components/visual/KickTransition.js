import styled from "styled-components";
import { animated } from "react-spring";
import { useTransition } from "react-spring";

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

export function KickTransition({ effect, setEffect }) {
  const kickTransition = useTransition(effect, {
    config: { tension: 150 },
    from: { y: 1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: -1000, opacity: 0 },
    onRest: () => setEffect(false),
  });

  const kickTransitionReverse = useTransition(effect, {
    config: { tension: 150 },
    from: { y: -1000, opacity: 0 },
    enter: { y: 0, opacity: 1 },
    leave: { y: 1000, opacity: 0 },
    onRest: () => setEffect(false),
  });

  return (
    <>
      {kickTransition((style, item) =>
        item ? <KickElement style={style} /> : <></>
      )}
      {kickTransitionReverse((style, item) =>
        item ? <KickElementReverse style={style} /> : <></>
      )}
    </>
  );
}
