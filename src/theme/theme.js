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
      ":host,:root": {
        "--chakra-ui-focus-ring-color": "#805ad555",
      },
    },
  },
  shadows: {
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
  },
});
export default theme;
