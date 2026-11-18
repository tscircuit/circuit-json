import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

const cell_index = z.number().int().nonnegative().safe()

export const drawing_table_cell = z
  .object({
    type: z.literal("drawing_table_cell"),
    drawing_table_cell_id: z.string().trim().min(1),
    drawing_table_id: z.string().trim().min(1),
    start_row_index: cell_index,
    end_row_index: cell_index,
    start_column_index: cell_index,
    end_column_index: cell_index,
    text: z.string(),
    horizontal_align: z.enum(["left", "center", "right"]).optional(),
    font_size: z.number().finite().positive().optional(),
  })
  .refine((cell) => cell.end_row_index >= cell.start_row_index, {
    message: "end_row_index must not precede start_row_index",
    path: ["end_row_index"],
  })
  .refine((cell) => cell.end_column_index >= cell.start_column_index, {
    message: "end_column_index must not precede start_column_index",
    path: ["end_column_index"],
  })
  .describe(
    "One cell of a drawing_table. Row and column indexes are 0-based from the table's top-left; start and end are inclusive, so a cell spanning columns 0 through 2 merges three columns. text is resolved by the producer and escaped, never markup. horizontal_align defaults to center; font_size is paper mm, default 2.8. Consumers validate that cells lie inside their table and do not overlap.",
  )

export interface DrawingTableCell {
  type: "drawing_table_cell"
  drawing_table_cell_id: string
  drawing_table_id: string
  /** 0-based from the top row; start and end are inclusive. */
  start_row_index: number
  end_row_index: number
  /** 0-based from the left column; start and end are inclusive. */
  start_column_index: number
  end_column_index: number
  text: string
  /** Defaults to center. */
  horizontal_align?: "left" | "center" | "right"
  /** Paper mm, default 2.8. */
  font_size?: number
}
export type DrawingTableCellInput = z.input<typeof drawing_table_cell>
expectTypesMatch<DrawingTableCell, z.infer<typeof drawing_table_cell>>(true)
