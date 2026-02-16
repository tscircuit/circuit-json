import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const asset = z.object({
  project_relative_path: z.string(),
  url: z.string(),
  mimetype: z.string(),
})

export type AssetInput = z.input<typeof asset>
export type Asset = z.infer<typeof asset>

expectTypesMatch<Asset, AssetInput>(true)
