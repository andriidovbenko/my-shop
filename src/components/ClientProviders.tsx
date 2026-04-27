"use client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";
import { CartProvider } from "@/context/CartContext";
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmotionRegistry } from "@/components/EmotionRegistry";
import { ChatWidget } from "@/components/chat/ChatWidget";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider theme={theme}>
        <CartProvider>
          <Box minH="100vh" display="flex" flexDirection="column">
            <Header />
            <Box as="main" flex="1">
              {children}
            </Box>
            <Footer />
          </Box>
          <ChatWidget />
        </CartProvider>
      </ChakraProvider>
    </EmotionRegistry>
  );
}
