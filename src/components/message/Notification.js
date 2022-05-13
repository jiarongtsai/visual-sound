import React from "react";
import { Box, keyframes } from "@chakra-ui/react";
const ringScaleMin = 0.11;
const ringScaleMax = 0.66;

const pulseRing = keyframes`
	0% {
    transform: scale(${ringScaleMin});
  }
	30% {
		transform: scale(${ringScaleMax});
	},
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
	`;

const pulseDot = keyframes`
	0% {
    transform: scale(0.9);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(0.9);
  }
	`;

export const Notification = ({ right, top, activeColor }) => {
  return (
    <Box
      as="div"
      h="12px"
      w="12px"
      mb="1.99em"
      position="absolute"
      right={right}
      top={top}
      bgColor={activeColor}
      borderRadius="50%"
      _before={{
        content: "''",
        position: "absolute",
        display: "block",
        width: "300%",
        height: "300%",
        boxSizing: "border-box",
        marginLeft: "-100%",
        marginTop: "-100%",
        borderRadius: "50%",
        bgColor: activeColor,
        animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
      }}
      _after={{
        animation: `2.25s ${pulseDot} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
      }}
    />
  );
};
