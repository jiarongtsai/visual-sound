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
const IconBoom = () => {
  return (
    <IconWrapper>
      <Boom width="25px" aria-label="boom" opacity="0.7" />
    </IconWrapper>
  );
};
