import { type SchemaTypeDefinition } from "sanity"
import { category } from "./category"
import { product } from "./product"
import { order } from "./order"

export const schemaTypes: SchemaTypeDefinition[] = [
  category,
  product,
  order,
]
