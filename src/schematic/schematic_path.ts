import { z } from "zod"
import { point } from "../common/point"

export const schematic_path = z.object({
  type: z.literal("schematic_path"),
  schematic_component_id: z.string(),
  fill_color: z.enum(["red", "blue"]).optional(),
  is_filled: z.boolean().optional(),
  points: z.array(point),
})

export type SchematicPathInput = z.input<typeof schematic_path>
export type SchematicPath = z.infer<typeof schematic_path>
