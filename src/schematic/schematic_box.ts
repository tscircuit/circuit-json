import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicBox {
  type: "schematic_box"
  schematic_component_id: string
  width: number
  height: number
  padding?: number
  title?: string
  overlay: string[]
  x: number
  y: number
}

export const schematic_box = z
  .object({
    type: z.literal("schematic_box"),
    schematic_component_id: z.string(),
    width: distance,
    height: distance,
    padding: distance.optional(),
    title: z.string().optional(),
    overlay: z.string().array(),
    x: distance,
    y: distance,
  })
  .describe("Draws a box on the schematic")

export type SchematicBoxInput = z.input<typeof schematic_box>
type InferredSchematicBox = z.infer<typeof schematic_box>

expectTypesMatch<SchematicBox, InferredSchematicBox>(true)
