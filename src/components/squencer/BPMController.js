import React, { useState } from "react";

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from "@chakra-ui/react";

export default function BPMController({ BPMValue, setBPMValue }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Slider
      w="180px"
      id="slider"
      defaultValue={120}
      min={40}
      max={200}
      colorScheme="purple"
      value={BPMValue}
      onChange={(v) => setBPMValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={60} mt="2" ml="-2.5" fontSize="sm">
        60
      </SliderMark>
      <SliderMark value={120} mt="2" ml="-2.5" fontSize="sm">
        120
      </SliderMark>
      <SliderMark value={180} mt="2" ml="-2.5" fontSize="sm">
        180
      </SliderMark>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="purple.500"
        color="white"
        placement="top"
        isOpen={showTooltip}
        label={BPMValue}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
}
