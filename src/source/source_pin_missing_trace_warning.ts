import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_pin_missing_trace_warning = z
  .object({
    type: z.literal("source_pin_missing_trace_warning"),
    source_pin_missing_trace_warning_id: getZodPrefixedIdWithDefault(
      "source_pin_missing_trace_warning",
    ),
    warning_type: z
      .literal("source_pin_missing_trace_warning")
      .default("source_pin_missing_trace_warning"),
    message: z.string(),
    source_component_id: z.string(),
    source_port_id: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a source component pin is missing a trace connection",
  )

export type SourcePinMissingTraceWarningInput = z.input<
  typeof source_pin_missing_trace_warning
>
type InferredSourcePinMissingTraceWarning = z.infer<
  typeof source_pin_missing_trace_warning
>

/**
 * Warning emitted when a source component pin is missing a trace connection
 */
export interface SourcePinMissingTraceWarning {
  type: "source_pin_missing_trace_warning"
  source_pin_missing_trace_warning_id: string
  warning_type: "source_pin_missing_trace_warning"
  message: string
  source_component_id: string
  source_port_id: string
  subcircuit_id?: string
}

expectTypesMatch<
  SourcePinMissingTraceWarning,
  InferredSourcePinMissingTraceWarning
>(true)
