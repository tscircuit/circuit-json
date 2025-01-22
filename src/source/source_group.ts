import { z } from "zod"

export const source_group = z.object({
  type: z.literal("source_group"),
  source_group_id: z.string(),
  subcircuit_id: z.string().optional(),
  parent_subcircuit_id: z.string().optional(),
  is_subcircuit: z.boolean().optional(),
  name: z.string().optional(),
})

export type SourceGroup = z.infer<typeof source_group>
export type SourceGroupInput = z.input<typeof source_group>
