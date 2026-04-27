"use client"
import { Button, type ButtonProps } from "@chakra-ui/react"
import Link from "next/link"

interface Props extends ButtonProps {
  href: string
}

export function LinkButton({ href, children, ...rest }: Props) {
  return (
    <Button as={Link} href={href} {...rest}>
      {children}
    </Button>
  )
}
