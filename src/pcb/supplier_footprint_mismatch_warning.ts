import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  supplier_name,
  type SupplierName,
} from "src/pcb/properties/supplier_name"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const supplier_footprint_mismatch_warning = z
  .object({
    type: z.literal("supplier_footprint_mismatch_warning"),
    supplier_footprint_mismatch_warning_id: getZodPrefixedIdWithDefault(
      "supplier_footprint_mismatch_warning",
    ),
    warning_type: z
      .literal("supplier_footprint_mismatch_warning")
      .default("supplier_footprint_mismatch_warning"),
    message: z.string(),
    source_component_id: z.string(),
    pcb_component_id: z.string().optional(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    supplier_name: supplier_name.optional(),
    supplier_part_number: z.string().optional(),
    expected_footprint: z.string().optional(),
    actual_footprint: z.string().optional(),
  })
  .describe(
    "Warning emitted when a supplier part footprint does not match the expected footprint",
  )

export type SupplierFootprintMismatchWarningInput = z.input<
  typeof supplier_footprint_mismatch_warning
>
type InferredSupplierFootprintMismatchWarning = z.infer<
  typeof supplier_footprint_mismatch_warning
>

/**
 * Warning emitted when a supplier part footprint does not match the expected footprint
 */
export interface SupplierFootprintMismatchWarning {
  type: "supplier_footprint_mismatch_warning"
  supplier_footprint_mismatch_warning_id: string
  warning_type: "supplier_footprint_mismatch_warning"
  message: string
  source_component_id: string
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
  supplier_name?: SupplierName
  supplier_part_number?: string
  expected_footprint?: string
  actual_footprint?: string
}

expectTypesMatch<
  SupplierFootprintMismatchWarning,
  InferredSupplierFootprintMismatchWarning
>(true)
