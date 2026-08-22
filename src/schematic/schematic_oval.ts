import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { point, type Point } from "../common/point"
import { distance } from "../units"

/** Draws a styled oval on the schematic */
export interface SchematicOval {
  type: "schematic_oval"
  schematic_oval_id: string
  schematic_sheet_id?: string
  schematic_component_id?: string
  schematic_symbol_id?: string
  center: Point
  radius_x: number
  radius_y: number
  stroke_width?: number | null
  color: string
  is_filled: boolean
  fill_color?: string
  is_dashed: boolean
  subcircuit_id?: string
}

export const schematic_oval = z
  .object({
    type: z.literal("schematic_oval"),
    schematic_oval_id: getZodPrefixedIdWithDefault("schematic_oval"),
    schematic_sheet_id: z.string().optional(),
    schematic_component_id: z.string().optional(),
    schematic_symbol_id: z.string().optional(),
    center: point,
    radius_x: distance,
    radius_y: distance,
    stroke_width: distance.nullable().optional(),
    color: z.string().default("#000000"),
    is_filled: z.boolean().default(false),
    fill_color: z.string().optional(),
    is_dashed: z.boolean().default(false),
    subcircuit_id: z.string().optional(),
  })
  .describe("Draws a styled oval on the schematic")

export type SchematicOvalInput = z.input<typeof schematic_oval>
type InferredSchematicOval = z.infer<typeof schematic_oval>

expectTypesMatch<SchematicOval, InferredSchematicOval>(true)
