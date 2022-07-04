import { useState, memo } from "react";
import PropTypes from "prop-types";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from "@chakra-ui/react";

export const BpmController = memo(({ BpmValue, setBpmValue }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let changing = false;

  function changeBpmValue(v) {
    if (changing) return;
    changing = true;
    setBpmValue(v);

    setTimeout(() => {
      changing = false;
    }, 2000);
  }

  return (
    <Slider
      w={{ base: "200px", lg: "180px", xl: "200px" }}
      id="slider"
      defaultValue={120}
      min={40}
      max={200}
      colorScheme="purple"
      value={BpmValue}
      onChange={(v) => changeBpmValue(v)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderMark value={60} mt="4" ml="-2.5" fontSize="sm">
        60
      </SliderMark>
      <SliderMark value={120} mt="4" ml="-2.5" fontSize="sm">
        120
      </SliderMark>
      <SliderMark value={180} mt="4" ml="-2.5" fontSize="sm">
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
        label={BpmValue}
      >
        <SliderThumb />
      </Tooltip>
    </Slider>
  );
});

BpmController.propTypes = {
  BpmValue: PropTypes.number,
  setBpmValue: PropTypes.func,
};
