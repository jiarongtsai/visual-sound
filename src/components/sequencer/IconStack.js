import { VStack } from "@chakra-ui/react";
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
} from "./helper/icon.js";

export const IconStack = ({ currentPage }) => {
  return (
    <VStack spacing={1}>
      {currentPage === 1 && (
        <>
          <IconBoom />
          <IconClap />
          <IconHiHat />
          <IconKick />
          <IconOpenHat />
          <IconRideCymbal />
          <IconSnare />
          <IconTom />
          <IconTink />
        </>
      )}
      {currentPage === 2 && (
        <>
          <IconRideCymbal />
          <IconSnare />
          <IconTom />
          <IconTink />
          <IconBoom />
          <IconClap />
          <IconHiHat />
          <IconKick />
          <IconOpenHat />
        </>
      )}
      {currentPage === 3 && (
        <>
          <IconTink />
          <IconHiHat />
          <IconKick />
          <IconOpenHat />
          <IconRideCymbal />
          <IconBoom />
          <IconClap />

          <IconSnare />
          <IconTom />
        </>
      )}
    </VStack>
  );
};
