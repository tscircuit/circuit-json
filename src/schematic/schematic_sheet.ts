import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const schematic_sheet_size = z.enum(["a4", "ansi_b"])
export type SchematicSheetSize = z.infer<typeof schematic_sheet_size>

export const schematic_sheet = z
  .object({
    type: z.literal("schematic_sheet"),
    schematic_sheet_id: getZodPrefixedIdWithDefault("schematic_sheet"),
    name: z.string().optional(),
    sheet_index: z.number().optional(),
    sheet_size: schematic_sheet_size.optional(),
    sheet_width: z.number().positive().optional(),
    sheet_height: z.number().positive().optional(),
    subcircuit_id: z.string().optional(),
    outline_color: z.string().optional(),
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
  sheet_size?: SchematicSheetSize
  sheet_width?: number
  sheet_height?: number
  subcircuit_id?: string
  outline_color?: string
}

expectTypesMatch<SchematicSheet, InferredSchematicSheet>(true)
