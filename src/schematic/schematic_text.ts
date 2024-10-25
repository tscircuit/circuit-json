import { z } from "zod"
import { distance } from "../units"

export const schematic_text = z.object({
  type: z.literal("schematic_text"),
  schematic_component_id: z.string(),
  schematic_text_id: z.string(),
  text: z.string(),
  position: z.object({
    x: distance,
    y: distance,
  }),
  rotation: z.number().default(0),
  anchor: z
    .enum(["center", "left", "right", "top", "bottom"])
    .default("center"),
  color: z.string().default("#000000"),
})

export type SchematicTextInput = z.input<typeof schematic_text>
export type SchematicText = z.infer<typeof schematic_text>
