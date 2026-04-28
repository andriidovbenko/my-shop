import { defineType, defineField } from "sanity"

export const product = defineType({
  name: "product",
  title: "Товар",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Назва",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Опис",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "price",
      title: "Ціна (грн)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "images",
      title: "Фото",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "asset", type: "image", title: "Зображення", options: { hotspot: true } },
            { name: "alt", type: "string", title: "Alt-текст", validation: (Rule) => Rule.required() },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Категорія",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "inStock",
      title: "В наявності",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "attributes",
      title: "Характеристики",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", type: "string", title: "Назва" },
            { name: "value", type: "string", title: "Значення" },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string", validation: (Rule) => Rule.max(60) },
        { name: "metaDescription", title: "Meta Description", type: "text", validation: (Rule) => Rule.max(160) },
        { name: "ogImage", title: "OG Image", type: "image", options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0.asset" },
  },
})
