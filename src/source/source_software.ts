import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceSoftware {
  type: "source_software"
  user_agent: string
  tscircuit_core_version: string
  created_at: string
}

export const source_software = z.object({
  type: z.literal("source_software"),
  user_agent: z.string(),
  tscircuit_core_version: z.string(),
  created_at: z.string().datetime(),
})

export type InferredSourceSoftware = z.infer<typeof source_software>
expectTypesMatch<SourceSoftware, InferredSourceSoftware>(true)
