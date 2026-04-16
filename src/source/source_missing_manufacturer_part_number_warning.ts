import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_missing_manufacturer_part_number_warning = z
  .object({
    type: z.literal("source_missing_manufacturer_part_number_warning"),
    source_missing_manufacturer_part_number_warning_id:
      getZodPrefixedIdWithDefault(
        "source_missing_manufacturer_part_number_warning",
      ),
    warning_type: z
      .literal("source_missing_manufacturer_part_number_warning")
      .default("source_missing_manufacturer_part_number_warning"),
    message: z.string(),
    source_component_id: z.string(),
    standard: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a standard connector is missing manufacturer part number",
  )

export type SourceMissingManufacturerPartNumberWarningInput = z.input<
  typeof source_missing_manufacturer_part_number_warning
>
type InferredSourceMissingManufacturerPartNumberWarning = z.infer<
  typeof source_missing_manufacturer_part_number_warning
>

/**
 * Warning emitted when a standard connector is missing manufacturer part number
 */
export interface SourceMissingManufacturerPartNumberWarning {
  type: "source_missing_manufacturer_part_number_warning"
  source_missing_manufacturer_part_number_warning_id: string
  warning_type: "source_missing_manufacturer_part_number_warning"
  message: string
  source_component_id: string
  standard: string
  subcircuit_id?: string
}

expectTypesMatch<
  SourceMissingManufacturerPartNumberWarning,
  InferredSourceMissingManufacturerPartNumberWarning
>(true)
