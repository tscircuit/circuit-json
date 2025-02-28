import { z } from "zod"

export interface ProjectMetadata {
  type: "source_project_metadata"
  name?: string
  software_used_string?: string
  created_at?: string // ISO8601 timestamp
}

export const project_metadata = z.object({
  type: z.literal("source_project_metadata"),
  name: z.string().optional(),
  software_used_string: z.string().optional(),
  created_at: z.string().datetime().optional(),
})

export type InferredProjectMetadata = z.infer<typeof project_metadata>
