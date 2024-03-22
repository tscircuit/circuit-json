import { z } from "zod"

export const source_component_base = z.object({
  type: z.literal("source_component"),
  // ftype?: string
  // source_component_id: string
  // name: string
  ftype: z.string().optional(),
  source_component_id: z.string(),
  name: z.string(),
})
