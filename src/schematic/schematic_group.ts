import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_group = z
  .object({
    type: z.literal("schematic_group"),
    schematic_group_id: getZodPrefixedIdWithDefault("schematic_group"),
    source_group_id: z.string(),
    is_subcircuit: z.boolean().optional(),
    subcircuit_id: z.string().optional(),
    width: length,
    height: length,
    center: point,
    schematic_component_ids: z.array(z.string()),
    show_as_schematic_box: z.boolean().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .describe("Defines a group of components on the schematic")

export type SchematicGroupInput = z.input<typeof schematic_group>
type InferredSchematicGroup = z.infer<typeof schematic_group>

/**
 * Defines a group of components on the schematic
 */
export interface SchematicGroup {
  type: "schematic_group"
  schematic_group_id: string
  source_group_id: string
  is_subcircuit?: boolean
  subcircuit_id?: string
  width: Length
  height: Length
  center: Point
  schematic_component_ids: string[]
  show_as_schematic_box?: boolean
  name?: string
  description?: string
}

expectTypesMatch<SchematicGroup, InferredSchematicGroup>(true)
