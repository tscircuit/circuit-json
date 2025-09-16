import { z } from "zod"
import { point, type Point } from "../common/point"
import { distance } from "../units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Draws a styled circle on the schematic */
export interface SchematicCircle {
  type: "schematic_circle"
  schematic_circle_id: string
  schematic_component_id: string
  center: Point
  radius: number
  stroke_width: number
  color: string
  is_filled: boolean
  fill_color?: string
  is_dashed: boolean
  subcircuit_id?: string
}

export const schematic_circle = z
  .object({
    type: z.literal("schematic_circle"),
    schematic_circle_id: getZodPrefixedIdWithDefault("schematic_circle"),
    schematic_component_id: z.string(),
    center: point,
    radius: distance,
    stroke_width: distance.default(0.02),
    color: z.string().default("#000000"),
    is_filled: z.boolean().default(false),
    fill_color: z.string().optional(),
    is_dashed: z.boolean().default(false),
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a styled circle on the schematic")

export type SchematicCircleInput = z.input<typeof schematic_circle>
type InferredSchematicCircle = z.infer<typeof schematic_circle>

expectTypesMatch<SchematicCircle, InferredSchematicCircle>(true)
