import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_element_outside_sheet_warning = z
  .object({
    type: z.literal("schematic_element_outside_sheet_warning"),
    schematic_element_outside_sheet_warning_id: getZodPrefixedIdWithDefault(
      "schematic_element_outside_sheet_warning",
    ),
    warning_type: z
      .literal("schematic_element_outside_sheet_warning")
      .default("schematic_element_outside_sheet_warning"),
    message: z.string(),
    schematic_sheet_id: z.string(),
    schematic_element_type: z.enum([
      "schematic_component",
      "schematic_net_label",
      "schematic_trace",
    ]),
    schematic_element_id: z.string(),
  })
  .describe(
    "Warning emitted when a schematic component, net label, or trace extends outside its schematic sheet",
  )

export type SchematicElementOutsideSheetWarningInput = z.input<
  typeof schematic_element_outside_sheet_warning
>
type InferredSchematicElementOutsideSheetWarning = z.infer<
  typeof schematic_element_outside_sheet_warning
>

/** Warning emitted when a schematic component, net label, or trace extends outside its schematic sheet */
export interface SchematicElementOutsideSheetWarning {
  type: "schematic_element_outside_sheet_warning"
  schematic_element_outside_sheet_warning_id: string
  warning_type: "schematic_element_outside_sheet_warning"
  message: string
  schematic_sheet_id: string
  schematic_element_type:
    | "schematic_component"
    | "schematic_net_label"
    | "schematic_trace"
  schematic_element_id: string
}

expectTypesMatch<
  SchematicElementOutsideSheetWarning,
  InferredSchematicElementOutsideSheetWarning
>(true)
