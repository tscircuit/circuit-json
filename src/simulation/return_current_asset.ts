import { z } from "zod"
import { asset } from "../common"

function createReturnCurrentAssetSchema(mimetypes: readonly string[]) {
  return asset
    .extend({
      project_relative_path: z.string().min(1),
      url: z.string().url(),
    })
    .superRefine((value, context) => {
      if (!mimetypes.includes(value.mimetype)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mimetype"],
          message: `Expected one of: ${mimetypes.join(", ")}`,
        })
      }
      if (value.url.startsWith("data:")) {
        const mediaType = /^data:([^;,]*)(?:;[^,]*)?,/i.exec(value.url)?.[1]
        if (mediaType?.toLowerCase() !== value.mimetype) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["url"],
            message: "Data URL media type must match asset.mimetype",
          })
        }
      }
    })
}

/** MIME type selects decoding; filename extensions are only a convention. */
export const return_current_field_asset = createReturnCurrentAssetSchema([
  "application/json",
  "application/gzip",
])

export const return_current_image_asset = createReturnCurrentAssetSchema([
  "image/png",
  "image/webp",
])
