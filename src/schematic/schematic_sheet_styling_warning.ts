import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_sheet_styling_warning = z
  .object({
    type: z.literal("schematic_sheet_styling_warning"),
    schematic_sheet_styling_warning_id: getZodPrefixedIdWithDefault(
      "schematic_sheet_styling_warning",
    ),
    warning_type: z
      .literal("schematic_sheet_styling_warning")
      .default("schematic_sheet_styling_warning"),
    message: z.string(),
    schematic_sheet_id: z.string(),
    styling_issue_type: z.literal("non_default_sheet_size"),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Style warning emitted when a schematic sheet uses a non-default size",
  )

export type SchematicSheetStylingWarningInput = z.input<
  typeof schematic_sheet_styling_warning
>
type InferredSchematicSheetStylingWarning = z.infer<
  typeof schematic_sheet_styling_warning
>

/** Style warning emitted when a schematic sheet uses a non-default size. */
export interface SchematicSheetStylingWarning {
  type: "schematic_sheet_styling_warning"
  schematic_sheet_styling_warning_id: string
  warning_type: "schematic_sheet_styling_warning"
  message: string
  schematic_sheet_id: string
  styling_issue_type: "non_default_sheet_size"
  subcircuit_id?: string
}

expectTypesMatch<
  SchematicSheetStylingWarning,
  InferredSchematicSheetStylingWarning
>(true)
