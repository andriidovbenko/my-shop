"use client"
import { useEffect } from "react"
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed"

export function TrackProductView({ slug }: { slug: string }) {
  const { track } = useRecentlyViewed()
  useEffect(() => {
    track(slug)
  }, [slug, track])
  return null
}
