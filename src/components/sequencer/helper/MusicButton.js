import { Tooltip, IconButton, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
export const MusicButton = ({
  label,
  icon,
  onClick,
  cursor,
  placement,
  ...props
}) => {
  return (
    <Tooltip
      hasArrow
      bg={useColorModeValue("gray.500", "gray.300")}
      label={label}
      placement={placement}
    >
      <IconButton
        rounded="full"
        aria-label={label}
        icon={icon}
        onClick={onClick}
        cursor={cursor}
        {...props}
      />
    </Tooltip>
  );
};

MusicButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func,
  cursor: PropTypes.string,
  placement: PropTypes.string,
};
