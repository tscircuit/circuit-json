import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_component_overlap_warning = z
  .object({
    type: z.literal("schematic_component_overlap_warning"),
    schematic_component_overlap_warning_id: getZodPrefixedIdWithDefault(
      "schematic_component_overlap_warning",
    ),
    warning_type: z
      .literal("schematic_component_overlap_warning")
      .default("schematic_component_overlap_warning"),
    message: z.string(),
    schematic_component_ids: z.tuple([z.string(), z.string()]),
    schematic_sheet_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when the rendered bounds of two schematic components overlap",
  )

export type SchematicComponentOverlapWarningInput = z.input<
  typeof schematic_component_overlap_warning
>
type InferredSchematicComponentOverlapWarning = z.infer<
  typeof schematic_component_overlap_warning
>

/** Warning emitted when the rendered bounds of two schematic components overlap */
export interface SchematicComponentOverlapWarning {
  type: "schematic_component_overlap_warning"
  schematic_component_overlap_warning_id: string
  warning_type: "schematic_component_overlap_warning"
  message: string
  schematic_component_ids: [string, string]
  schematic_sheet_id?: string
}

expectTypesMatch<
  SchematicComponentOverlapWarning,
  InferredSchematicComponentOverlapWarning
>(true)
