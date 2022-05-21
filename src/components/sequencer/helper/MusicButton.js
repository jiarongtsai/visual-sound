import { Tooltip, IconButton, useColorModeValue } from "@chakra-ui/react";
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
