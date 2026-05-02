"use client"
import { useEffect } from "react"
import { sendGAEvent } from "@next/third-parties/google"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"

interface Props {
  slug: string
  name: string
  price: number
  category?: string
}

export function TrackProductView({ slug, name, price, category }: Props) {
  const { track } = useRecentlyViewed()
  useEffect(() => {
    track(slug)
    sendGAEvent("event", "view_item", {
      currency: "UAH",
      value: price,
      items: [{ item_id: slug, item_name: name, price, item_category: category }],
    })
  }, [slug, name, price, category, track])
  return null
}
