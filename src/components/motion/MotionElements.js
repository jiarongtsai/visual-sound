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

export const MotionElements = ({ visualEffect, setVisualEffect }) => {
  return (
    <>
      <BoomTransition
        alphabeta="a"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <KickTransition
        alphabeta="f"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <TomTransition
        alphabeta="k"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <ClapTransition
        alphabeta="s"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <HihatTransition
        alphabeta="d"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <OpenhatTransition
        alphabeta="g"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <RideTransition
        alphabeta="h"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <SnareTransition
        alphabeta="j"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
      <TinkTransition
        alphabeta="k"
        effect={visualEffect}
        setEffect={setVisualEffect}
      />
    </>
  );
};

MotionElements.propTypes = {
  visualEffect: PropTypes.object,
  setVisualEffect: PropTypes.func,
};
