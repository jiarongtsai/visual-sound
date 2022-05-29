import { VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
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
} from "./helper/icon.js";

export const IconStack = ({ currentPage }) => {
  return (
    <VStack spacing={1}>
      {currentPage === 1 && (
        <>
          <IconUnknown />
          <IconXylophone />
          <IconXylophone />
          <IconSnareSide />
          <IconCymbal />
          <IconCrashCymbal />
          <IconClap />
          <IconClap />
          <IconRideCymbal />
        </>
      )}
      {currentPage === 2 && (
        <>
          <IconRideCymbal />
          <IconHiHat />
          <IconReverse />
          <IconSnare />
          <IconSnare />
          <IconKick />
          <IconBoom />
          <IconBrush />
          <IconMaracas />
        </>
      )}
      {currentPage === 3 && (
        <>
          <IconTink />
          <IconScratch />
          <IconHiHat />
          <IconHiHat />
          <IconOpenHat />
          <IconBoom />
          <IconTomLarge />
          <IconTom />
          <IconTom />
        </>
      )}
    </VStack>
  );
};

IconStack.propsTypes = { currentPage: PropTypes.number };
