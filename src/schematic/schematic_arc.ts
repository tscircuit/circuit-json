import { z } from "zod"
import { point, type Point } from "../common/point"
import { distance, rotation } from "../units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Draws a styled arc on the schematic */
export interface SchematicArc {
  type: "schematic_arc"
  schematic_arc_id: string
  schematic_component_id: string
  center: Point
  radius: number
  start_angle_degrees: number
  end_angle: number
  direction: "clockwise" | "counterclockwise"
  stroke_width?: number | null
  color: string
  is_dashed: boolean
  subcircuit_id?: string
}

export const schematic_arc = z
  .object({
    type: z.literal("schematic_arc"),
    schematic_arc_id: getZodPrefixedIdWithDefault("schematic_arc"),
    schematic_component_id: z.string(),
    center: point,
    radius: distance,
    start_angle_degrees: rotation,
    end_angle: rotation,
    direction: z
      .enum(["clockwise", "counterclockwise"])
      .default("counterclockwise"),
    stroke_width: distance.nullable().optional(),
    color: z.string().default("#000000"),
    is_dashed: z.boolean().default(false),
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a styled arc on the schematic")

export type SchematicArcInput = z.input<typeof schematic_arc>
type InferredSchematicArc = z.infer<typeof schematic_arc>

expectTypesMatch<SchematicArc, InferredSchematicArc>(true)
