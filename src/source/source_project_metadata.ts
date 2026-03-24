import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { timestamp } from "src/units"

export interface SourceProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  project_url?: string
  created_at?: string // ISO8601 timestamp
  schematic_disabled?: boolean
}

export const source_project_metadata = z.object({
  type: z.literal("source_project_metadata"),
  name: z.string().optional(),
  software_used_string: z.string().optional(),
  project_url: z.string().optional(),
  created_at: timestamp.optional(),
  schematic_disabled: z.boolean().optional(),
})

export type InferredProjectMetadata = z.infer<typeof source_project_metadata>
expectTypesMatch<SourceProjectMetadata, InferredProjectMetadata>(true)
