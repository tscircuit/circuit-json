import { z } from "zod"
import { point, type Point } from "../common/point"
import { distance, rotation } from "../units"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Draws a styled rectangle on the schematic */
export interface SchematicRect {
  type: "schematic_rect"
  schematic_rect_id: string
  schematic_component_id: string
  center: Point
  width: number
  height: number
  corner_radius?: number
  rotation: number
  stroke_width?: number | null
  color: string
  is_filled: boolean
  fill_color?: string
  is_dashed: boolean
  subcircuit_id?: string
}

export const schematic_rect = z
  .object({
    type: z.literal("schematic_rect"),
    schematic_rect_id: getZodPrefixedIdWithDefault("schematic_rect"),
    schematic_component_id: z.string(),
    center: point,
    width: distance,
    height: distance,
    corner_radius: distance.optional(),
    rotation: rotation.default(0),
    stroke_width: distance.nullable().optional(),
    color: z.string().default("#000000"),
    is_filled: z.boolean().default(false),
    fill_color: z.string().optional(),
    is_dashed: z.boolean().default(false),
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a styled rectangle on the schematic")

export type SchematicRectInput = z.input<typeof schematic_rect>
type InferredSchematicRect = z.infer<typeof schematic_rect>

expectTypesMatch<SchematicRect, InferredSchematicRect>(true)
