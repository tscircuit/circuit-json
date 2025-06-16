import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  project_url?: string
  created_at?: string // ISO8601 timestamp
}

export const source_project_metadata = z.object({
  type: z.literal("source_project_metadata"),
  name: z.string().optional(),
  software_used_string: z.string().optional(),
  project_url: z.string().optional(),
  created_at: z.string().datetime().optional(),
})

export type InferredProjectMetadata = z.infer<typeof source_project_metadata>
expectTypesMatch<SourceProjectMetadata, InferredProjectMetadata>(true)
