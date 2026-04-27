"use client"
import { useSyncExternalStore, useCallback, useMemo } from "react"

const KEY = "rv_products"
const MAX = 8
const EVENT = "rv_update"

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener("storage", cb)
  }
}

function getSnapshot() {
  try { return localStorage.getItem(KEY) ?? "[]" } catch { return "[]" }
}

function getServerSnapshot() {
  return "[]"
}

export function useRecentlyViewed() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const slugs = useMemo<string[]>(() => {
    try { return JSON.parse(raw) } catch { return [] }
  }, [raw])

  const track = useCallback((slug: string) => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]")
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(next))
      window.dispatchEvent(new Event(EVENT))
    } catch {}
  }, [])

  return { slugs, track }
}
