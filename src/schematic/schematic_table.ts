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

export const schematic_table = z
  .object({
    type: z.literal("schematic_table"),
    schematic_table_id: getZodPrefixedIdWithDefault("schematic_table"),
    anchor_position: point,
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
  anchor_position: Point
  column_widths: Length[]
  row_heights: Length[]
  cell_padding?: Length
  border_width?: Length
  subcircuit_id?: string
  schematic_component_id?: string
  anchor?: NinePointAnchor
}

expectTypesMatch<SchematicTable, InferredSchematicTable>(true)
