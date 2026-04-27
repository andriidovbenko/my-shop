import { defineType, defineField } from "sanity"

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending Payment", value: "pending_payment" },
          { title: "Paid", value: "paid" },
          { title: "In Production", value: "in_production" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
        ],
      },
      initialValue: "pending_payment",
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "email", type: "string", title: "Email" },
        { name: "phone", type: "string", title: "Phone" },
        { name: "messenger", type: "string", title: "Preferred Messenger" },
      ],
    }),
    defineField({
      name: "delivery",
      title: "Delivery",
      type: "object",
      fields: [
        { name: "carrier", type: "string", title: "Carrier" },
        { name: "city", type: "string", title: "City" },
        // Nova Poshta
        { name: "cityRef", type: "string", title: "City Ref (NP)" },
        { name: "deliveryType", type: "string", title: "Delivery Type (NP)" },
        { name: "warehouseRef", type: "string", title: "Warehouse Ref (NP)" },
        { name: "warehouseDescription", type: "string", title: "Warehouse (NP)" },
        // Ukrposhta
        { name: "deliveryMethod", type: "string", title: "Delivery Method (UP)" },
        { name: "postIndex", type: "string", title: "Post Index (UP)" },
        { name: "streetAddress", type: "string", title: "Street Address (UP courier)" },
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", type: "string", title: "Product ID" },
            { name: "name", type: "string", title: "Name" },
            { name: "quantity", type: "number", title: "Quantity" },
            { name: "price", type: "number", title: "Price" },
          ],
        },
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount (UAH)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],
})
