import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  const bgDefault = useColorModeValue("gray.100", "gray.600");

  return (
    <Box
      px={[6, 6, 3]}
      py={[4, 4, 2]}
      rounded={"md"}
      fontWeight={[400, 400, 600]}
      w="100%"
      _hover={{
        bg: bgDefault,
      }}
    >
      <Link
        style={{
          borderBottom: match && "2px solid #805ad5",
        }}
        to={to}
        {...props}
      >
        {children}
      </Link>
    </Box>
  );
}

CustomLink.propTypes = { children: PropTypes.string, to: PropTypes.string };
