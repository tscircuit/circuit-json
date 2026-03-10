import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_no_ground_pin_defined_warning = z
  .object({
    type: z.literal("source_no_ground_pin_defined_warning"),
    source_no_ground_pin_defined_warning_id: getZodPrefixedIdWithDefault(
      "source_no_ground_pin_defined_warning",
    ),
    warning_type: z
      .literal("source_no_ground_pin_defined_warning")
      .default("source_no_ground_pin_defined_warning"),
    message: z.string(),
    source_component_id: z.string(),
    source_port_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a chip has no source ports marked as ground pins",
  )

export type SourceNoGroundPinDefinedWarningInput = z.input<
  typeof source_no_ground_pin_defined_warning
>
type InferredSourceNoGroundPinDefinedWarning = z.infer<
  typeof source_no_ground_pin_defined_warning
>

/**
 * Warning emitted when a chip has no source ports marked as ground pins
 */
export interface SourceNoGroundPinDefinedWarning {
  type: "source_no_ground_pin_defined_warning"
  source_no_ground_pin_defined_warning_id: string
  warning_type: "source_no_ground_pin_defined_warning"
  message: string
  source_component_id: string
  source_port_ids: string[]
  subcircuit_id?: string
}

expectTypesMatch<
  SourceNoGroundPinDefinedWarning,
  InferredSourceNoGroundPinDefinedWarning
>(true)
