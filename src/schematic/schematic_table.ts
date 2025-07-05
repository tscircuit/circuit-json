import { z } from "zod"
import {
  getZodPrefixedIdWithDefault,
  ninePointAnchor,
  point,
  type NinePointAnchor,
  type Point,
} from "src/common"
import { distance, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_table_cell = z.object({
  text: z.string(),
  horizontal_align: z.enum(["left", "center", "right"]).optional(),
  vertical_align: z.enum(["top", "middle", "bottom"]).optional(),
  font_size: distance.optional(),
})

export interface SchematicTableCell {
  text: string
  horizontal_align?: "left" | "center" | "right"
  vertical_align?: "top" | "middle" | "bottom"
  font_size?: Length
}

expectTypesMatch<SchematicTableCell, z.infer<typeof schematic_table_cell>>(true)

export const schematic_table = z
  .object({
    type: z.literal("schematic_table"),
    schematic_table_id: z.string(),
    position: point,
    rows: z.array(z.array(schematic_table_cell)),
    column_widths: z.array(distance),
    row_heights: z.array(distance),
    cell_padding: distance.optional(),
    border_width: distance.optional(),
    subcircuit_id: z.string().optional(),
    schematic_component_id: z.string().optional(),
    anchor: ninePointAnchor.optional(),
  })
  .describe("Defines a table on the schematic")

export type SchematicTableInput = z.input<typeof schematic_table>
type InferredSchematicTable = z.infer<typeof schematic_table>

/**
 * Defines a table on the schematic, useful for displaying data in a structured format.
 */
export interface SchematicTable {
  type: "schematic_table"
  schematic_table_id: string
  position: Point
  rows: SchematicTableCell[][]
  column_widths: Length[]
  row_heights: Length[]
  cell_padding?: Length
  border_width?: Length
  subcircuit_id?: string
  schematic_component_id?: string
  anchor?: NinePointAnchor
}

expectTypesMatch<SchematicTable, InferredSchematicTable>(true)
