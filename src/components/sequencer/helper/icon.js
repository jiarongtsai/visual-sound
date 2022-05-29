import { Square, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ReactComponent as Boom } from "../../../asset/react_icon/icon_boom.svg";
import { ReactComponent as Clap } from "../../../asset/react_icon/icon_clap.svg";
import { ReactComponent as HiHat } from "../../../asset/react_icon/icon_hiHat.svg";
import { ReactComponent as OpenHat } from "../../../asset/react_icon/icon_openHat.svg";
import { ReactComponent as RideCymbal } from "../../../asset/react_icon/icon_rideCymbal.svg";
import { ReactComponent as Kick } from "../../../asset/react_icon/icon_kick.svg";
import { ReactComponent as Snare } from "../../../asset/react_icon/icon_snare.svg";
import { ReactComponent as Tom } from "../../../asset/react_icon/icon_tom.svg";
import { ReactComponent as Tink } from "../../../asset/react_icon/icon_tink.svg";
import { ReactComponent as Brush } from "../../../asset/react_icon/icon_brush.svg";
import { ReactComponent as Maracas } from "../../../asset/react_icon/icon_maracas.svg";
import { ReactComponent as Cymbal } from "../../../asset/react_icon/icon_cymbal.svg";
import { ReactComponent as Scratch } from "../../../asset/react_icon/icon_scratch.svg";
import { ReactComponent as Unknown } from "../../../asset/react_icon/icon_unknown.svg";
import { ReactComponent as Reverse } from "../../../asset/react_icon/icon_reverse.svg";
import { ReactComponent as Xylophone } from "../../../asset/react_icon/icon_xylophone.svg";
import { ReactComponent as TomLarge } from "../../../asset/react_icon/icon_tomLarge.svg";
import { ReactComponent as SnareSide } from "../../../asset/react_icon/icon_snareSide.svg";
import { ReactComponent as CrashCymbal } from "../../../asset/react_icon/icon_crashCymbal.svg";

export {
  IconClap,
  IconHiHat,
  IconOpenHat,
  IconRideCymbal,
  IconKick,
  IconBoom,
  IconSnare,
  IconTom,
  IconTink,
  IconBrush,
  IconCrashCymbal,
  IconCymbal,
  IconMaracas,
  IconReverse,
  IconScratch,
  IconSnareSide,
  IconTomLarge,
  IconUnknown,
  IconXylophone,
};

const IconWrapper = ({ children }) => {
  const bgColor = useColorModeValue("gray.100", "gray.400");
  const activeColor = useColorModeValue("gray.300", "gray.100");
  return (
    <Square
      size="36px"
      rounded="md"
      bg={bgColor}
      _active={{
        background: activeColor,
      }}
    >
      {children}
    </Square>
  );
};

IconWrapper.propTypes = {
  children: PropTypes.element,
};

const IconUnknown = () => (
  <IconWrapper>
    <Unknown width="26px" aria-label="Unknown" opacity="0.7" />
  </IconWrapper>
);
const IconMaracas = () => (
  <IconWrapper>
    <Maracas width="27px" aria-label="Maracas" opacity="0.7" />
  </IconWrapper>
);
const IconBrush = () => (
  <IconWrapper>
    <Brush width="27px" aria-label="Brush" opacity="0.7" />
  </IconWrapper>
);
const IconTomLarge = () => (
  <IconWrapper>
    <TomLarge width="24px" aria-label="TomLarge" opacity="0.7" />
  </IconWrapper>
);
const IconSnareSide = () => (
  <IconWrapper>
    <SnareSide width="28px" aria-label="SnareSide" opacity="0.7" />
  </IconWrapper>
);
const IconXylophone = () => (
  <IconWrapper>
    <Xylophone width="27px" aria-label="xylophone" opacity="0.7" />
  </IconWrapper>
);
const IconCymbal = () => (
  <IconWrapper>
    <Cymbal width="27px" aria-label="cymbal" opacity="0.7" />
  </IconWrapper>
);
const IconScratch = () => (
  <IconWrapper>
    <Scratch width="27px" aria-label="scratch" opacity="0.7" />
  </IconWrapper>
);
const IconReverse = () => (
  <IconWrapper>
    <Reverse width="28px" aria-label="reverse" opacity="0.7" />
  </IconWrapper>
);
const IconCrashCymbal = () => (
  <IconWrapper>
    <CrashCymbal width="27px" aria-label="crashCymbal" opacity="0.7" />
  </IconWrapper>
);

const IconTink = () => {
  return (
    <IconWrapper>
      <Tink width="25px" aria-label="tink" opacity="0.7" />
    </IconWrapper>
  );
};
const IconRideCymbal = () => {
  return (
    <IconWrapper>
      <RideCymbal width="27px" aria-label="rideCymbal" opacity="0.7" />
    </IconWrapper>
  );
};

const IconClap = () => {
  return (
    <IconWrapper>
      <Clap width="25px" aria-label="clap" opacity="0.6" />
    </IconWrapper>
  );
};

const IconKick = () => {
  return (
    <IconWrapper>
      <Kick width="25px" aria-label="kick" opacity="0.7" />
    </IconWrapper>
  );
};
const IconSnare = () => {
  return (
    <IconWrapper>
      <Snare width="25px" aria-label="snare" opacity="0.7" />
    </IconWrapper>
  );
};
const IconTom = () => {
  return (
    <IconWrapper>
      <Tom width="31px" aria-label="clap" opacity="0.8" />
    </IconWrapper>
  );
};
const IconOpenHat = () => {
  return (
    <IconWrapper>
      <OpenHat width="25px" aria-label="openHat" opacity="0.7" />
    </IconWrapper>
  );
};
const IconHiHat = () => {
  return (
    <IconWrapper>
      <HiHat width="25px" aria-label="hiHat" opacity="0.7" />
    </IconWrapper>
  );
};
const IconBoom = () => (
  <IconWrapper>
    <Boom width="25px" aria-label="boom" opacity="0.7" />
  </IconWrapper>
);
