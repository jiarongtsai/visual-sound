import styled from "@emotion/styled";
import { animated, useSpring } from "react-spring";
import PropTypes from "prop-types";
const ChainWrapper = styled(animated.div)`
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
`;

export default function ChainSpring({ children, open }) {
  const styles = useSpring({
    config: { friction: 50, delay: 3000 },
    loop: open,
    to: [{ y: -8 }, { y: 0 }],
    from: { y: 0 },
  });
  // ...
  return <ChainWrapper style={styles}>{children}</ChainWrapper>;
}

ChainSpring.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
};
