import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { distance, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_table_cell = z
  .object({
    type: z.literal("schematic_table_cell"),
    schematic_table_cell_id: getZodPrefixedIdWithDefault(
      "schematic_table_cell",
    ),
    schematic_table_id: z.string(),
    start_row_index: z.number(),
    end_row_index: z.number(),
    start_column_index: z.number(),
    end_column_index: z.number(),
    text: z.string().optional(),
    center: point,
    width: distance,
    height: distance,
    horizontal_align: z.enum(["left", "center", "right"]).optional(),
    vertical_align: z.enum(["top", "middle", "bottom"]).optional(),
    font_size: distance.optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a cell within a schematic_table")

export type SchematicTableCellInput = z.input<typeof schematic_table_cell>
type InferredSchematicTableCell = z.infer<typeof schematic_table_cell>

/**
 * Defines a cell within a schematic_table
 */
export interface SchematicTableCell {
  type: "schematic_table_cell"
  schematic_table_cell_id: string
  schematic_table_id: string
  start_row_index: number
  end_row_index: number
  start_column_index: number
  end_column_index: number
  text?: string
  center: Point
  width: Length
  height: Length
  horizontal_align?: "left" | "center" | "right"
  vertical_align?: "top" | "middle" | "bottom"
  font_size?: Length
  subcircuit_id?: string
}

expectTypesMatch<SchematicTableCell, InferredSchematicTableCell>(true)
