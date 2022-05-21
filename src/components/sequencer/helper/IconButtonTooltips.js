import { Tooltip, useColorModeValue } from "@chakra-ui/react";
export const IconButtonTooltip = ({ label, placement, children }) => {
  return (
    <Tooltip
      hasArrow
      bg={useColorModeValue("gray.500", "gray.300")}
      label={label}
      placement={placement}
    >
      {children}
    </Tooltip>
  );
};
