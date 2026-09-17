import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_too_long_error = z
  .object({
    type: z.literal("pcb_trace_too_long_error"),
    pcb_trace_too_long_error_id: getZodPrefixedIdWithDefault(
      "pcb_trace_too_long_error",
    ),
    error_type: z
      .literal("pcb_trace_too_long_error")
      .default("pcb_trace_too_long_error"),
    message: z.string(),
    pcb_trace_id: z.string(),
    source_net_id: z.string().optional(),
    source_trace_id: z.string().optional(),
    actual_trace_length: distance,
    maximum_trace_length: distance,
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a PCB trace is longer than its maximum allowed length",
  )

export type PcbTraceTooLongErrorInput = z.input<typeof pcb_trace_too_long_error>
type InferredPcbTraceTooLongError = z.infer<typeof pcb_trace_too_long_error>

/** Error emitted when a PCB trace is longer than its maximum allowed length */
export interface PcbTraceTooLongError {
  type: "pcb_trace_too_long_error"
  pcb_trace_too_long_error_id: string
  error_type: "pcb_trace_too_long_error"
  message: string
  pcb_trace_id: string
  source_net_id?: string
  source_trace_id?: string
  actual_trace_length: Distance
  maximum_trace_length: Distance
  subcircuit_id?: string
}

expectTypesMatch<PcbTraceTooLongError, InferredPcbTraceTooLongError>(true)
