import { ReactComponent as Boom } from "../../asset/react_icon/icon_boom.svg";
import { ReactComponent as Clap } from "../../asset/react_icon/icon_clap.svg";
import { ReactComponent as HiHat } from "../../asset/react_icon/icon_hiHat.svg";
import { ReactComponent as OpenHat } from "../../asset/react_icon/icon_openHat.svg";
import { ReactComponent as RideCymbal } from "../../asset/react_icon/icon_rideCymbal.svg";
import { ReactComponent as Kick } from "../../asset/react_icon/icon_kick.svg";
import { ReactComponent as Snare } from "../../asset/react_icon/icon_snare.svg";
import { ReactComponent as Tom } from "../../asset/react_icon/icon_tom.svg";
import { ReactComponent as Tink } from "../../asset/react_icon/icon_tink.svg";
import { Square, useColorModeValue } from "@chakra-ui/react";

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

const IconTink = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Tink width="25px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
const IconRideCymbal = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <RideCymbal width="28px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};

const IconClap = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Clap width="25px" aria-label="clap" opacity="0.6" />
    </Square>
  );
};

const IconKick = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Kick width="26px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
const IconSnare = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Snare width="25px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
const IconTom = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Tom width="32px" aria-label="clap" opacity="0.8" />
    </Square>
  );
};
const IconOpenHat = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <OpenHat width="26px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
const IconHiHat = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <HiHat width="26px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
const IconBoom = () => {
  return (
    <Square
      size="36px"
      rounded="md"
      bg={useColorModeValue("gray.100", "gray.400")}
    >
      <Boom width="26px" aria-label="clap" opacity="0.7" />
    </Square>
  );
};
