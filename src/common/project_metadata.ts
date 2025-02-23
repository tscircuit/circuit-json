import { z } from "zod"

export interface ProjectMetadata {
  name?: string
  software_used_string?: string
  created_at?: string // ISO8601 timestamp
}

export const project_metadata = z.object({
  name: z.string().optional(),
  software_used_string: z.string().optional(),
  created_at: z.string().datetime().optional(),
})

export type InferredProjectMetadata = z.infer<typeof project_metadata>
