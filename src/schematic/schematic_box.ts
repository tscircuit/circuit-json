import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicBox {
  type: "schematic_box"
  schematic_component_id: string
  width: number
  height: number
  overlay?: string[]
  is_dashed: boolean
  x: number
  y: number
}

export const schematic_box = z
  .object({
    type: z.literal("schematic_box"),
    schematic_component_id: z.string(),
    width: distance,
    height: distance,
    overlay: z.array(z.string()).optional(),
    is_dashed: z.boolean().default(false),
    x: distance,
    y: distance,
  })
  .describe("Draws a box on the schematic")

export type SchematicBoxInput = z.input<typeof schematic_box>
type InferredSchematicBox = z.infer<typeof schematic_box>

expectTypesMatch<SchematicBox, InferredSchematicBox>(true)
