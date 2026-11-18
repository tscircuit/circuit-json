import { z } from "zod"
import { ninePointAnchor, type NinePointAnchor } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const drawing_table = z
  .object({
    type: z.literal("drawing_table"),
    drawing_table_id: z.string().trim().min(1),
    drawing_page_id: z.string().min(1),
    name: z.string().optional(),
    anchor_position: z.object({
      x: z.number().finite(),
      y: z.number().finite(),
    }),
    anchor_alignment: ninePointAnchor,
    column_widths: z.array(z.number().finite().positive()).min(1),
    row_heights: z.array(z.number().finite().positive()).min(1),
  })
  .describe(
    "A table on a drawing sheet, such as a parts list or a wiring list. anchor_alignment names the point of the table's outer rectangle that sits at anchor_position, in page-anchor-relative paper mm, +X right/+Y up. column_widths run left to right and row_heights top to bottom, in paper mm. Content is carried by drawing_table_cell records; a table states layout only and derives nothing from other elements.",
  )

export interface DrawingTable {
  type: "drawing_table"
  drawing_table_id: string
  drawing_page_id: string
  name?: string
  /** Where the anchor_alignment point of the table sits, relative to the page anchor. */
  anchor_position: { x: number; y: number }
  /** Which point of the table's outer rectangle anchor_position locates. */
  anchor_alignment: NinePointAnchor
  /** Left to right, paper mm. */
  column_widths: number[]
  /** Top to bottom, paper mm. */
  row_heights: number[]
}
export type DrawingTableInput = z.input<typeof drawing_table>
expectTypesMatch<DrawingTable, z.infer<typeof drawing_table>>(true)
