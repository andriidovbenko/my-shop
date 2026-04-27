import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e8f4fd",
      100: "#cce6fb",
      200: "#99cdf6",
      300: "#66b3f2",
      400: "#3399ed",
      500: "#1A8FE3",
      600: "#1478c5",
      700: "#0f5fa0",
      800: "#0a467a",
      900: "#052d54",
    },
    orange: {
      50: "#fff4e8",
      100: "#ffe3c2",
      200: "#ffc880",
      300: "#ffac3e",
      400: "#F5821F",
      500: "#e06a00",
      600: "#c05800",
      700: "#9a4500",
      800: "#733300",
      900: "#4d2200",
    },
    dark: {
      900: "#1e1e2e",
      800: "#2B2D35",
      700: "#3a3d4a",
    },
  },
  fonts: {
    heading: "var(--font-body), Inter, sans-serif",
    body: "var(--font-body), Inter, sans-serif",
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "var(--font-body), Inter, sans-serif",
      },
    },
  },
  radii: {
    card: "12px",
  },
  shadows: {
    card: "0 2px 8px rgba(0,0,0,0.08)",
  },
  semanticTokens: {
    colors: {
      "bg.default": { default: "white" },
      "bg.card": { default: "gray.50" },
      "text.default": { default: "gray.900" },
      "text.muted": { default: "gray.500" },
      "accent.default": { default: "brand.500" },
      "accent.hover": { default: "brand.600" },
      "border.default": { default: "gray.200" },
    },
  },
})

export default theme
