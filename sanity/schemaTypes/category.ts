import { defineType, defineField } from "sanity"

export const category = defineType({
  name: "category",
  title: "Категорія",
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
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Зображення",
      type: "image",
      options: {
        hotspot: true,
      },
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
    select: { title: "name", media: "image" },
  },
})
