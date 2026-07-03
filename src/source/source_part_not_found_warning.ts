import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  supplier_name,
  type SupplierName,
} from "src/pcb/properties/supplier_name"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_part_not_found_warning = z
  .object({
    type: z.literal("source_part_not_found_warning"),
    source_part_not_found_warning_id: getZodPrefixedIdWithDefault(
      "source_part_not_found_warning",
    ),
    warning_type: z
      .literal("source_part_not_found_warning")
      .default("source_part_not_found_warning"),
    message: z.string(),
    source_component_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    supplier_name: supplier_name.optional(),
    manufacturer_part_number: z.string().optional(),
    supplier_part_number: z.string().optional(),
    part_name: z.string().optional(),
  })
  .describe("Warning emitted when a requested part can not be found")

export type SourcePartNotFoundWarningInput = z.input<
  typeof source_part_not_found_warning
>
type InferredSourcePartNotFoundWarning = z.infer<
  typeof source_part_not_found_warning
>

/**
 * Warning emitted when a requested part can not be found
 */
export interface SourcePartNotFoundWarning {
  type: "source_part_not_found_warning"
  source_part_not_found_warning_id: string
  warning_type: "source_part_not_found_warning"
  message: string
  source_component_id?: string
  subcircuit_id?: string
  supplier_name?: SupplierName
  manufacturer_part_number?: string
  supplier_part_number?: string
  part_name?: string
}

expectTypesMatch<SourcePartNotFoundWarning, InferredSourcePartNotFoundWarning>(
  true,
)
