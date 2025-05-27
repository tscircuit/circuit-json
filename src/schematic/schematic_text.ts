import { z } from "zod"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { ninePointAnchor } from "src/common/NinePointAnchor"
import type { NinePointAnchor } from "src/common/NinePointAnchor"
import type { FivePointAnchor } from "src/common/FivePointAnchor"
import { fivePointAnchor } from "src/common/FivePointAnchor"

export interface SchematicText {
  type: "schematic_text"
  schematic_component_id?: string
  schematic_text_id: string
  text: string
  font_size: number
  position: {
    x: number
    y: number
  }
  rotation: number
  anchor: NinePointAnchor | FivePointAnchor
  color: string
}

export const schematic_text = z.object({
  type: z.literal("schematic_text"),
  schematic_component_id: z.string().optional(),
  schematic_text_id: z.string(),
  text: z.string(),
  font_size: z.number().default(0.18),
  position: z.object({
    x: distance,
    y: distance,
  }),
  rotation: z.number().default(0),
  anchor: z
    .union([fivePointAnchor.describe("legacy"), ninePointAnchor])
    .default("center"),
  color: z.string().default("#000000"),
})

export type SchematicTextInput = z.input<typeof schematic_text>
type InferredSchematicText = z.infer<typeof schematic_text>

expectTypesMatch<SchematicText, InferredSchematicText>(true)
