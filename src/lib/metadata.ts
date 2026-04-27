const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "My Shop"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export function buildTitle(page: string): string {
  return page
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

export { SITE_NAME, SITE_URL }
