import { defineType, defineField } from "sanity"

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "price",
      title: "Price (UAH)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "asset", type: "image", title: "Image", options: { hotspot: true } },
            { name: "alt", type: "string", title: "Alt Text", validation: (Rule) => Rule.required() },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "attributes",
      title: "Attributes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", type: "string", title: "Key" },
            { name: "value", type: "string", title: "Value" },
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
})
