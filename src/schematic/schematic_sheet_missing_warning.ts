import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_sheet_missing_warning = z
  .object({
    type: z.literal("schematic_sheet_missing_warning"),
    schematic_sheet_missing_warning_id: getZodPrefixedIdWithDefault(
      "schematic_sheet_missing_warning",
    ),
    warning_type: z
      .literal("schematic_sheet_missing_warning")
      .default("schematic_sheet_missing_warning"),
    message: z.string(),
    sheet_name: z.string(),
    source_component_id: z.string(),
    schematic_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a component references a schSheetName that does not match any schematic sheet",
  )

export type SchematicSheetMissingWarningInput = z.input<
  typeof schematic_sheet_missing_warning
>
type InferredSchematicSheetMissingWarning = z.infer<
  typeof schematic_sheet_missing_warning
>

/**
 * Warning emitted when a component references a schSheetName that does not
 * match any schematic sheet
 */
export interface SchematicSheetMissingWarning {
  type: "schematic_sheet_missing_warning"
  schematic_sheet_missing_warning_id: string
  warning_type: "schematic_sheet_missing_warning"
  message: string
  sheet_name: string
  source_component_id: string
  schematic_component_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  SchematicSheetMissingWarning,
  InferredSchematicSheetMissingWarning
>(true)
