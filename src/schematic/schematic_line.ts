import { z } from "zod"
import { distance } from "../units"

export const schematic_line = z.object({
  type: z.literal("schematic_line"),
  schematic_component_id: z.string(),
  x1: distance,
  x2: distance,
  y1: distance,
  y2: distance,
})

export type SchematicLineInput = z.input<typeof schematic_line>
export type SchematicLine = z.infer<typeof schematic_line>
