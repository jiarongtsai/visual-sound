import { BoomTransition } from "./BoomTransition";
import { ClapTransition } from "./ClapTransition";
import { HihatTransition } from "./HihatTransition";
import { KickTransition } from "./KickTransition";
import { OpenhatTransition } from "./OpenhatTransition";
import { RideTransition } from "./RideTransition";
import { SnareTransition } from "./SnareTransition";
import { TomTransition } from "./TomTransition";
import { TinkTransition } from "./TinkTransition";

export const MotionElement = ({ visualEffect, setVisualEffect }) => {
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
