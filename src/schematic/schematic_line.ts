import { z } from "zod"
import { point, type Point } from "../common/point"
import { distance } from "../units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Draws a styled line on the schematic */
export interface SchematicLine {
  type: "schematic_line"
  schematic_line_id: string
  schematic_component_id: string
  start: Point
  end: Point
  stroke_width: number
  color: string
  is_dashed: boolean
  subcircuit_id?: string
}

export const schematic_line = z
  .object({
    type: z.literal("schematic_line"),
    schematic_line_id: getZodPrefixedIdWithDefault("schematic_line"),
    schematic_component_id: z.string(),
    start: point,
    end: point,
    stroke_width: distance.default(0.02),
    color: z.string().default("#000000"),
    is_dashed: z.boolean().default(false),
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a styled line on the schematic")

export type SchematicLineInput = z.input<typeof schematic_line>
type InferredSchematicLine = z.infer<typeof schematic_line>

expectTypesMatch<SchematicLine, InferredSchematicLine>(true)
