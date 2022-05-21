import { extendTheme } from "@chakra-ui/react";

const variantOutlined = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 2px var(--chakra-ui-focus-ring-color)",
    },
  },
});

const variantFilled = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 1px var(--chakra-ui-focus-ring-color)",
    },
  },
});

const variantFlushed = () => ({
  field: {
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 1px 0 0 var(--chakra-ui-focus-ring-color)",
    },
  },
});

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "Mukta, sans-serif",
    body: "Mukta, sans-serif",
  },
  styles: {
    global: {
      // Create a CSS variable with the focus ring color desired.
      // rgba function does not work here so use the hex value.
      // Either :host,:root or html work. body does not work for
      // button, checkbox, radio, switch.
      // html: {
      ":host,:root": {
        "--chakra-ui-focus-ring-color": "#805ad555",
      },
    },
  },
  shadows: {
    // This is also possible. Not sure I like inject this into
    // an existing theme section.
    // It creates a CSS variable named --chakra-shadows-focus-ring-color
    // 'focus-ring-color': 'rgba(255, 0, 125, 0.6)',
    outline: "0 0 0 3px var(--chakra-ui-focus-ring-color)",
  },
  components: {
    Input: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
      },
    },
    Select: {
      variants: {
        outline: variantOutlined,
        filled: variantFilled,
        flushed: variantFlushed,
      },
    },
    Textarea: {
      variants: {
        outline: () => variantOutlined().field,
        filled: () => variantFilled().field,
        flushed: () => variantFlushed().field,
      },
    },
    // Alert: {
    //   variants: {
    //     "top-accent": (props) => {
    //       // only applies to `subtle` variant
    //       const { colorScheme: c } = props;
    //       // if (c !== "blue") {
    //       //   // use original definition for all color schemes except "blue"
    //       //   return origTheme.components.Alert.variants.subtle(props)
    //       // }
    //       return {
    //         container: {
    //           bg: "purple.500", // or literal color, e.g. "#0984ff"
    //           opacity: ".7",
    //           backdropFilter: "blur(2px) ",
    //           color: "white",
    //           borderColor: "purple.500",
    //         },
    //         icon: {
    //           color: "white",
    //         },
    //       };
    //     },
    //   },
    // },
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
