import { defineConfig } from "sanity";
import { schemaTypes } from "./schemaTypes";
import { structureTool } from "sanity/structure";

export default defineConfig({
  basePath: "/studio",
  name: "my_shop",
  title: "My Shop",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
