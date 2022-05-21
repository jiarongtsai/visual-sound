import { animated, useSpring } from "react-spring";
export default function ScaleSpring({ children, move }) {
  const styles = useSpring({
    config: { friction: 30, delay: 5000 },
    loop: move,
    to: [{ scale: 1.05 }, { scale: 1 }],
    from: { scale: 1 },
  });

  return <animated.div style={styles}>{children}</animated.div>;
}
