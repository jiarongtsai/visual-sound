import { Tooltip, IconButton, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
export const MusicButton = ({
  label,
  icon,
  onClick,
  cursor,
  bg,
  placement,
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
        bg={bg}
      />
    </Tooltip>
  );
};

MusicButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.element,
  onClick: PropTypes.func,
  cursor: PropTypes.string,
  bg: PropTypes.string,
  placement: PropTypes.string,
};
