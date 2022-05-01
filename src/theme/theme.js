import { extendTheme } from "@chakra-ui/react";
// import type { ComponentStyleConfig } from "@chakra-ui/theme";

const Input = {
  baseStyle: {
    focusBorderColor: "purple.500",
  },
};

const colors = {
  component: {
    Input,
  },
  // brand: {
  //   900: "#1a365d",
  //   800: "#153e75",
  //   700: "#2a69ac",
  // },
};

export const theme = extendTheme({ colors });
