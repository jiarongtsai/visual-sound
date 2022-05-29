import { Tooltip, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
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

IconButtonTooltip.propTypes = {
  label: PropTypes.string,
  placement: PropTypes.string,
  children: PropTypes.element,
};
