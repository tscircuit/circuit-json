import { z } from "zod"
import { distance } from "../units"

export const schematic_box = z
  .object({
    type: z.literal("schematic_box"),
    schematic_component_id: z.string(),
    width: distance,
    height: distance,
    x: distance,
    y: distance,
  })
  .describe("Draws a box on the schematic")

export type SchematicBoxInput = z.input<typeof schematic_box>
export type SchematicBox = z.infer<typeof schematic_box>
