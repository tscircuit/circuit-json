import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_too_long_warning = z
  .object({
    type: z.literal("pcb_trace_too_long_warning"),
    pcb_trace_too_long_warning_id: getZodPrefixedIdWithDefault(
      "pcb_trace_too_long_warning",
    ),
    warning_type: z
      .literal("pcb_trace_too_long_warning")
      .default("pcb_trace_too_long_warning"),
    message: z.string(),
    pcb_trace_id: z.string(),
    source_trace_id: z.string(),
    actual_trace_length: distance,
    maximum_trace_length: distance,
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Warning emitted when a PCB trace is longer than its maximum allowed length",
  )

export type PcbTraceTooLongWarningInput = z.input<
  typeof pcb_trace_too_long_warning
>
type InferredPcbTraceTooLongWarning = z.infer<typeof pcb_trace_too_long_warning>

/** Warning emitted when a PCB trace is longer than its maximum allowed length */
export interface PcbTraceTooLongWarning {
  type: "pcb_trace_too_long_warning"
  pcb_trace_too_long_warning_id: string
  warning_type: "pcb_trace_too_long_warning"
  message: string
  pcb_trace_id: string
  source_trace_id: string
  actual_trace_length: Distance
  maximum_trace_length: Distance
  subcircuit_id?: string
}

expectTypesMatch<PcbTraceTooLongWarning, InferredPcbTraceTooLongWarning>(true)
