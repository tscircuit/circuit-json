import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Circuit-wide warning: display as a banner, without a target outline or leader. */
export const schematic_missing_sheet_warning = z
  .object({
    type: z.literal("schematic_missing_sheet_warning"),
    schematic_missing_sheet_warning_id: getZodPrefixedIdWithDefault(
      "schematic_missing_sheet_warning",
    ),
    warning_type: z
      .literal("schematic_missing_sheet_warning")
      .default("schematic_missing_sheet_warning"),
    message: z.string(),
  })
  .describe(
    "Circuit-wide warning emitted when a schematic has no schematic sheet. Display as a banner without attaching it to a component or drawing a target outline or leader line.",
  )

export type SchematicMissingSheetWarningInput = z.input<
  typeof schematic_missing_sheet_warning
>
type InferredSchematicMissingSheetWarning = z.infer<
  typeof schematic_missing_sheet_warning
>

/** Circuit-wide warning that a schematic has no sheet; has no component target. */
export interface SchematicMissingSheetWarning {
  type: "schematic_missing_sheet_warning"
  schematic_missing_sheet_warning_id: string
  warning_type: "schematic_missing_sheet_warning"
  message: string
}

expectTypesMatch<
  SchematicMissingSheetWarning,
  InferredSchematicMissingSheetWarning
>(true)
