"use client";
import { Container, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Container maxW="7xl" py={20} display="flex" justifyContent="center" alignItems="center" minH="50vh">
      <Spinner size="xl" color="accent.default" />
    </Container>
  );
}