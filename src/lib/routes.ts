export const routes = {
  home: "/",
  catalog: "/catalog",
  cart: "/cart",
  checkout: "/checkout",
  about: "/about",
  privacy: "/privacy",
  offer: "/offer",
  product: (slug: string) => `/product/${slug}`,
  category: (categorySlug: string) => `/catalog?category=${categorySlug}`,
} as const
