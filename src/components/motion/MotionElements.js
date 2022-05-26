import PropTypes from "prop-types";
import { BoomTransition } from "./motionElements/BoomTransition";
import { ClapTransition } from "./motionElements/ClapTransition";
import { HihatTransition } from "./motionElements/HihatTransition";
import { KickTransition } from "./motionElements/KickTransition";
import { OpenhatTransition } from "./motionElements/OpenhatTransition";
import { RideTransition } from "./motionElements/RideTransition";
import { SnareTransition } from "./motionElements/SnareTransition";
import { TomTransition } from "./motionElements/TomTransition";
import { TinkTransition } from "./motionElements/TinkTransition";

const mappingObject = {
  q: SnareTransition,
  w: SnareTransition,
  e: SnareTransition,
  r: TinkTransition,
  t: RideTransition,
  y: RideTransition,
  u: ClapTransition,
  i: ClapTransition,
  o: RideTransition,
  p: RideTransition,
  a: HihatTransition,
  s: HihatTransition,
  d: TomTransition,
  f: TomTransition,
  g: BoomTransition,
  h: BoomTransition,
  j: OpenhatTransition,
  k: OpenhatTransition,
  l: TinkTransition,
  z: OpenhatTransition,
  x: HihatTransition,
  c: HihatTransition,
  v: BoomTransition,
  b: KickTransition,
  n: KickTransition,
  m: KickTransition,
  ";": OpenhatTransition,
};

export const MotionElements = ({ visualEffect, setVisualEffect }) => {
  return (
    <>
      {Object.entries(mappingObject).map(([key, Value]) => {
        return (
          <Value
            key={key}
            alphabeta={key}
            effect={visualEffect}
            setEffect={setVisualEffect}
          />
        );
      })}
    </>
  );
};

MotionElements.propTypes = {
  visualEffect: PropTypes.object,
  setVisualEffect: PropTypes.func,
};
