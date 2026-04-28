import { defineType, defineField } from "sanity"

export const productReview = defineType({
  name: "productReview",
  title: "Product Review",
  type: "document",
  fields: [
    defineField({ name: "productSlug", type: "string", title: "Product Slug" }),
    defineField({ name: "author", type: "string", title: "Author Name" }),
    defineField({ name: "rating", type: "number", title: "Rating (1–5)" }),
    defineField({ name: "body", type: "text", title: "Comment" }),
    defineField({ name: "approved", type: "boolean", title: "Approved", initialValue: true }),
    defineField({ name: "createdAt", type: "datetime", title: "Created At" }),
  ],
  preview: {
    select: { title: "author", subtitle: "productSlug" },
  },
})
