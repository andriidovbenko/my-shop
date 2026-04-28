import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityConfig } from "./client";

const builder = createImageUrlBuilder({
  ...sanityConfig,
  projectId: sanityConfig.projectId ?? "",
});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
