"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import Link from "next/link"

interface BreadcrumbSegment {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbSegment[]
}

export function Breadcrumbs({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb mb={4} fontSize="sm" color="text.muted">
        {items.map((item, index) => (
          <BreadcrumbItem key={index} isCurrentPage={!item.href || index === items.length - 1}>
            {item.href && index < items.length - 1 ? (
              <BreadcrumbLink as={Link} href={item.href} color="accent.default">
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbLink color="text.default">{item.label}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </>
  )
}
