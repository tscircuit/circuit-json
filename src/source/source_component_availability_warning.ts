import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  supplier_name,
  type SupplierName,
} from "src/pcb/properties/supplier_name"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_component_availability_warning = z
  .object({
    type: z.literal("source_component_availability_warning"),
    source_component_availability_warning_id: getZodPrefixedIdWithDefault(
      "source_component_availability_warning",
    ),
    warning_type: z
      .literal("source_component_availability_warning")
      .default("source_component_availability_warning"),
    message: z.string(),
    source_component_id: z.string(),
    subcircuit_id: z.string().optional(),
    supplier_name,
    supplier_part_numbers: z.array(z.string()).nonempty(),
  })
  .describe(
    "Warning emitted when no supplier alternative can be confirmed in stock. Availability may be unknown or change over time.",
  )

export type SourceComponentAvailabilityWarningInput = z.input<
  typeof source_component_availability_warning
>
type InferredSourceComponentAvailabilityWarning = z.infer<
  typeof source_component_availability_warning
>

/** Warning emitted when no supplier alternative can be confirmed in stock. */
export interface SourceComponentAvailabilityWarning {
  type: "source_component_availability_warning"
  source_component_availability_warning_id: string
  warning_type: "source_component_availability_warning"
  message: string
  source_component_id: string
  subcircuit_id?: string
  supplier_name: SupplierName
  supplier_part_numbers: [string, ...string[]]
}

expectTypesMatch<
  SourceComponentAvailabilityWarning,
  InferredSourceComponentAvailabilityWarning
>(true)
