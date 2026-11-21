import { schematic_length_unit, type SchematicLengthUnit } from "../units"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_group = z.object({
  type: z.literal("source_group"),
  source_group_id: z.string(),
  subcircuit_id: z.string().optional(),
  parent_subcircuit_id: z.string().optional(),
  parent_source_group_id: z.string().optional(),
  is_subcircuit: z.boolean().optional(),
  default_schematic_length_unit: schematic_length_unit.optional(),
  show_as_schematic_box: z.boolean().optional(),
  name: z.string().optional(),
  was_automatically_named: z.boolean().optional(),
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
  /** Unit of the stored schematic geometry owned by this subcircuit. Omission means legacy drawing units. */
  default_schematic_length_unit?: SchematicLengthUnit
  show_as_schematic_box?: boolean
  name?: string
  was_automatically_named?: boolean
}

expectTypesMatch<SourceGroup, InferredSourceGroup>(true)
