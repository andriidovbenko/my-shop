import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    brand: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
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
