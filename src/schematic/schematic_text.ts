import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export interface SchematicText {
  type: "schematic_text"
  schematic_component_id: string
  schematic_text_id: string
  text: string
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor:
    | "top_left"
    | "top_center"
    | "top_right"
    | "center_left"
    | "center"
    | "center_right"
    | "bottom_left"
    | "bottom_center"
    | "bottom_right"
  color: string
}

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
    .enum([
      "top_left",
      "top_center",
      "top_right",
      "center_left",
      "center",
      "center_right",
      "bottom_left",
      "bottom_center",
      "bottom_right",
    ])
    .default("center"),
  color: z.string().default("#000000"),
})

export type SchematicTextInput = z.input<typeof schematic_text>
type InferredSchematicText = z.infer<typeof schematic_text>

expectTypesMatch<SchematicText, InferredSchematicText>(true)
