import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_group = z.object({
  type: z.literal("source_group"),
  source_group_id: z.string(),
  subcircuit_id: z.string().optional(),
  parent_subcircuit_id: z.string().optional(),
  is_subcircuit: z.boolean().optional(),
  name: z.string().optional(),
})

export type SourceGroupInput = z.input<typeof source_group>
type InferredSourceGroup = z.infer<typeof source_group>

export interface SourceGroup {
  type: "source_group"
  source_group_id: string
  subcircuit_id?: string
  parent_subcircuit_id?: string
  is_subcircuit?: boolean
  name?: string
}

expectTypesMatch<SourceGroup, InferredSourceGroup>(true)
