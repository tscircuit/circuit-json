import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const schematic_text_overlap_warning = z
  .object({
    type: z.literal("schematic_text_overlap_warning"),
    schematic_text_overlap_warning_id: getZodPrefixedIdWithDefault(
      "schematic_text_overlap_warning",
    ),
    warning_type: z
      .literal("schematic_text_overlap_warning")
      .default("schematic_text_overlap_warning"),
    message: z.string(),
    schematic_text_ids: z.tuple([z.string(), z.string()]),
    schematic_sheet_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Warning emitted when two schematic text elements overlap")

export type SchematicTextOverlapWarningInput = z.input<
  typeof schematic_text_overlap_warning
>
type InferredSchematicTextOverlapWarning = z.infer<
  typeof schematic_text_overlap_warning
>

/** Warning emitted when two schematic text elements overlap */
export interface SchematicTextOverlapWarning {
  type: "schematic_text_overlap_warning"
  schematic_text_overlap_warning_id: string
  warning_type: "schematic_text_overlap_warning"
  message: string
  schematic_text_ids: [string, string]
  schematic_sheet_id?: string
  subcircuit_id?: string
}

expectTypesMatch<
  SchematicTextOverlapWarning,
  InferredSchematicTextOverlapWarning
>(true)
