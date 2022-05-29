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

const keyMotionMapping = [
  ["g", BoomTransition],
  ["h", BoomTransition],
  ["v", BoomTransition],
  ["b", KickTransition],
  ["n", KickTransition],
  ["m", KickTransition],
  ["d", TomTransition],
  ["f", TomTransition],
  ["r", TinkTransition],
  ["t", RideTransition],
  ["y", RideTransition],
  ["u", ClapTransition],
  ["i", ClapTransition],
  ["o", RideTransition],
  ["p", RideTransition],
  ["a", HihatTransition],
  ["s", HihatTransition],
  ["l", TinkTransition],
  ["x", HihatTransition],
  ["c", HihatTransition],
  ["j", OpenhatTransition],
  ["k", OpenhatTransition],
  ["z", OpenhatTransition],
  [";", OpenhatTransition],
  ["q", SnareTransition],
  ["w", SnareTransition],
  ["e", SnareTransition],
];

export const MotionElements = ({ visualEffect, setVisualEffect }) => {
  return (
    <>
      {keyMotionMapping.map(([alphabeta, Motion]) => {
        return (
          <Motion
            key={alphabeta}
            alphabeta={alphabeta}
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
