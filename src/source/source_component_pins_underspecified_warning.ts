import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_component_pins_underspecified_warning = z
  .object({
    type: z.literal("source_component_pins_underspecified_warning"),
    source_component_pins_underspecified_warning_id:
      getZodPrefixedIdWithDefault(
        "source_component_pins_underspecified_warning",
      ),
    warning_type: z
      .literal("source_component_pins_underspecified_warning")
      .default("source_component_pins_underspecified_warning"),
    message: z.string(),
    source_component_id: z.string(),
    source_port_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when all ports on a source component are underspecified",
  )

export type SourceComponentPinsUnderspecifiedWarningInput = z.input<
  typeof source_component_pins_underspecified_warning
>
type InferredSourceComponentPinsUnderspecifiedWarning = z.infer<
  typeof source_component_pins_underspecified_warning
>

/**
 * Warning emitted when all ports on a source component are underspecified
 */
export interface SourceComponentPinsUnderspecifiedWarning {
  type: "source_component_pins_underspecified_warning"
  source_component_pins_underspecified_warning_id: string
  warning_type: "source_component_pins_underspecified_warning"
  message: string
  source_component_id: string
  source_port_ids: string[]
  subcircuit_id?: string
}

expectTypesMatch<
  SourceComponentPinsUnderspecifiedWarning,
  InferredSourceComponentPinsUnderspecifiedWarning
>(true)
