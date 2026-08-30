import { getZodPrefixedIdWithDefault } from "src/common"
import { type Length, length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const schematic_config = z
  .object({
    type: z.literal("schematic_config"),
    schematic_config_id: getZodPrefixedIdWithDefault("schematic_config"),
    schematic_sheet_id: z.string().optional(),
    show_border: z.boolean().optional(),
    show_title_block: z.boolean().optional(),
    show_reference_zones: z.boolean().optional(),
    border_margin: length
      .refine((borderMargin) => borderMargin >= 0, {
        message: "border_margin must be non-negative",
      })
      .optional(),
    horizontal_zone_count: z.number().int().positive().optional(),
    vertical_zone_count: z.number().int().positive().optional(),
  })
  .describe(
    "Configures the presentation of a schematic document. When schematic_sheet_id is omitted, the configuration applies to schematic elements without a sheet ID.",
  )

export type SchematicConfigInput = z.input<typeof schematic_config>
type InferredSchematicConfig = z.infer<typeof schematic_config>

/**
 * Configures the presentation of a schematic document.
 * When schematic_sheet_id is omitted, the configuration applies to schematic
 * elements without a sheet ID.
 */
export interface SchematicConfig {
  type: "schematic_config"
  schematic_config_id: string
  schematic_sheet_id?: string
  /** Draw the sheet's outer and inner borders. */
  show_border?: boolean
  /** Draw the sheet's standard title block. */
  show_title_block?: boolean
  /** Draw coordinate labels around the sheet border. */
  show_reference_zones?: boolean
  /** Distance between the outer and inner sheet borders. */
  border_margin?: Length
  horizontal_zone_count?: number
  vertical_zone_count?: number
}

expectTypesMatch<SchematicConfig, InferredSchematicConfig>(true)
