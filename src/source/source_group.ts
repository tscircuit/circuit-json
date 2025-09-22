import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  schematic_pin_arrangement,
  type SchematicPinArrangement,
} from "../schematic/schematic_component"

export const source_group = z.object({
  type: z.literal("source_group"),
  source_group_id: z.string(),
  subcircuit_id: z.string().optional(),
  parent_subcircuit_id: z.string().optional(),
  parent_source_group_id: z.string().optional(),
  is_subcircuit: z.boolean().optional(),
  show_as_schematic_box: z.boolean().optional(),
  schematic_box_port_alias_map: z.record(z.string()).optional(),
  schematic_box_pin_arrangement: schematic_pin_arrangement.optional(),
  name: z.string().optional(),
})

export type SourceGroupInput = z.input<typeof source_group>
type InferredSourceGroup = z.infer<typeof source_group>

export interface SourceGroup {
  type: "source_group"
  source_group_id: string
  subcircuit_id?: string
  parent_subcircuit_id?: string
  parent_source_group_id?: string
  is_subcircuit?: boolean
  show_as_schematic_box?: boolean
  schematic_box_port_alias_map?: Record<string, string>
  schematic_box_pin_arrangement?: SchematicPinArrangement
  name?: string
}

expectTypesMatch<SourceGroup, InferredSourceGroup>(true)
