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
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
})
