import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_software = z.object({
  type: z.literal("source_software"),
  generator: z.string(),
  version: z.string(),
  created_at: z.string().datetime().optional(),
})

export interface SourceSoftware {
  type: "source_software"
  generator: string
  version: string
  created_at?: string
}

type InferredSourceSoftware = z.infer<typeof source_software>
expectTypesMatch<SourceSoftware, InferredSourceSoftware>(true)
