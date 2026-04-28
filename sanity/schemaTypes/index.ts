import { type SchemaTypeDefinition } from "sanity"
import { category } from "./category"
import { product } from "./product"
import { order } from "./order"
import { chatSession } from "./chatSession"
import { productReview } from "./productReview"

export const schemaTypes: SchemaTypeDefinition[] = [
  category,
  product,
  order,
  chatSession,
  productReview,
]
