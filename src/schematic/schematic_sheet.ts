import { z } from "zod"
import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_sheet = z
  .object({
    type: z.literal("schematic_sheet"),
    schematic_sheet_id: getZodPrefixedIdWithDefault("schematic_sheet"),
    name: z.string().optional(),
    sheet_index: z.number().optional(),
    subcircuit_id: z.string().optional(),
    outline_color: z.string().optional(),
    center: point.optional(),
    width: length.optional(),
    height: length.optional(),
    is_root: z.boolean().optional(),
  })
  .describe(
    "Defines a schematic sheet or page that components can be placed on",
  )

export type SchematicSheetInput = z.input<typeof schematic_sheet>
type InferredSchematicSheet = z.infer<typeof schematic_sheet>

/**
 * Defines a schematic sheet or page that components can be placed on.
 */
export interface SchematicSheet {
  type: "schematic_sheet"
  schematic_sheet_id: string
  name?: string
  sheet_index?: number
  subcircuit_id?: string
  outline_color?: string
  center?: Point
  width?: Length
  height?: Length
  is_root?: boolean
}

expectTypesMatch<SchematicSheet, InferredSchematicSheet>(true)
