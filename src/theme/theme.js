import { extendTheme } from "@chakra-ui/react";

// import type { ComponentStyleConfig } from "@chakra-ui/theme";

const theme = extendTheme({
  components: {
    Alert: {
      variants: {
        "top-accent": (props) => {
          // only applies to `subtle` variant
          const { colorScheme: c } = props;
          // if (c !== "blue") {
          //   // use original definition for all color schemes except "blue"
          //   return origTheme.components.Alert.variants.subtle(props)
          // }
          return {
            container: {
              bg: "purple.500", // or literal color, e.g. "#0984ff"
              opacity: ".7",
              backdropFilter: "blur(2px) ",
              color: "white",
              borderColor: "purple.500",
            },
            icon: {
              color: "white",
            },
          };
        },
      },
    },
    // Button: {
    //   // 1. We can update the base styles
    //   baseStyle: {
    //     fontWeight: "bold", // Normally, it is "semibold"
    //   },
    //   // 2. We can add a new button size or extend existing
    //   sizes: {
    //     xl: {
    //       h: "56px",
    //       fontSize: "lg",
    //       px: "32px",
    //     },
    //   },
    //   // 3. We can add a new visual variant
    //   variants: {
    //     "with-shadow": {
    //       bg: "red.400",
    //       boxShadow: "0 0 2px 2px #efdfde",
    //     },
    //     // 4. We can override existing variants
    //     solid: (props) => ({
    //       bg: props.colorMode === "dark" ? "red.300" : "red.500",
    //     }),
    //   },
    // },
  },
});
export default theme;
