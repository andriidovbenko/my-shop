import { defineType, defineField } from "sanity"

export const order = defineType({
  name: "order",
  title: "Замовлення",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Номер замовлення",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Статус",
      type: "string",
      options: {
        list: [
          { title: "Очікує оплати", value: "pending_payment" },
          { title: "Оплачено", value: "paid" },
          { title: "У виробництві", value: "in_production" },
          { title: "Відправлено", value: "shipped" },
          { title: "Доставлено", value: "delivered" },
        ],
      },
      initialValue: "pending_payment",
    }),
    defineField({
      name: "customer",
      title: "Покупець",
      type: "object",
      fields: [
        { name: "firstName", type: "string", title: "Ім'я" },
        { name: "lastName", type: "string", title: "Прізвище" },
        { name: "email", type: "string", title: "Email" },
        { name: "phone", type: "string", title: "Телефон" },
        { name: "messenger", type: "string", title: "Месенджер" },
      ],
    }),
    defineField({
      name: "delivery",
      title: "Доставка",
      type: "object",
      fields: [
        { name: "carrier", type: "string", title: "Перевізник" },
        { name: "city", type: "string", title: "Місто" },
        { name: "cityRef", type: "string", title: "Ref міста (НП)" },
        { name: "deliveryType", type: "string", title: "Тип доставки (НП)" },
        { name: "warehouseRef", type: "string", title: "Ref відділення (НП)" },
        { name: "warehouseDescription", type: "string", title: "Відділення (НП)" },
        { name: "deliveryMethod", type: "string", title: "Спосіб доставки (УП)" },
        { name: "postIndex", type: "string", title: "Поштовий індекс (УП)" },
        { name: "streetAddress", type: "string", title: "Адреса (УП кур'єр)" },
      ],
    }),
    defineField({
      name: "items",
      title: "Товари",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", type: "string", title: "ID товару" },
            { name: "name", type: "string", title: "Назва" },
            { name: "quantity", type: "number", title: "Кількість" },
            { name: "price", type: "number", title: "Ціна" },
          ],
        },
      ],
    }),
    defineField({
      name: "totalAmount",
      title: "Сума замовлення (грн)",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: "createdAt",
      title: "Дата створення",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "orderNumber", subtitle: "status" },
  },
})
