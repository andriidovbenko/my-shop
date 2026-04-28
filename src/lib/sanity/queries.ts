import { client } from "./client";
import type { Product, Category, ProductReview } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(`*[_type == "product" && inStock == true] {
    _id,
    name,
    slug,
    price,
    images,
    category->{_id, name, slug},
    inStock,
    attributes
  }`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(`*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    images,
    category->{_id, name, slug},
    inStock,
    attributes,
    youtubeUrl,
    seo
  }`, { slug });
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return client.fetch(`*[_type == "product" && inStock == true && category->slug.current == $categorySlug] {
    _id,
    name,
    slug,
    price,
    images,
    category->{_id, name, slug},
    inStock
  }`, { categorySlug });
}

export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(`*[_type == "category"] {
    _id,
    name,
    slug,
    image
  }`);
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "product"]{ "slug": slug.current }`);
}

export async function getSitemapProducts(): Promise<{ slug: string; updatedAt: string }[]> {
  return client.fetch(`*[_type == "product"]{ "slug": slug.current, "updatedAt": _updatedAt }`);
}

export async function getSitemapCategories(): Promise<{ slug: string }[]> {
  return client.fetch(`*[_type == "category"]{ "slug": slug.current }`);
}

export async function getProductReviews(productSlug: string): Promise<ProductReview[]> {
  return client.fetch(
    `*[_type == "productReview" && productSlug == $productSlug && approved == true] | order(createdAt desc) {
      _id, author, rating, body, createdAt
    }`,
    { productSlug }
  )
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return []
  return client.fetch(
    `*[_type == "product" && slug.current in $slugs && inStock == true] {
      _id, name, slug, price, images, category->{_id, name, slug}, inStock, attributes
    }`,
    { slugs }
  )
}
