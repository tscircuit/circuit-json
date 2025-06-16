import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicBox {
  type: "schematic_box"
  schematic_component_id?: string
  width: number
  height: number
  is_dashed: boolean
  x: number
  y: number
  subcircuit_id?: string
}

export const schematic_box = z
  .object({
    type: z.literal("schematic_box"),
    schematic_component_id: z.string().optional(),
    width: distance,
    height: distance,
    is_dashed: z.boolean().default(false),
    x: distance,
    y: distance,
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a box on the schematic")

export type SchematicBoxInput = z.input<typeof schematic_box>
type InferredSchematicBox = z.infer<typeof schematic_box>

expectTypesMatch<SchematicBox, InferredSchematicBox>(true)
