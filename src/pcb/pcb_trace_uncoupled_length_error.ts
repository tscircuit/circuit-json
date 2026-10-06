import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A trace exceeds its allowed total uncoupled planar route length. */
export interface PcbTraceUncoupledLengthError extends BaseCircuitJsonError {
  type: "pcb_trace_uncoupled_length_error"
  pcb_trace_uncoupled_length_error_id: string
  error_type: "pcb_trace_uncoupled_length_error"
  source_trace_id: string
  coupled_source_trace_id: string
  pcb_trace_ids: string[]
  actual_uncoupled_length: number
  maximum_uncoupled_length: number
  subcircuit_id?: string
}

export const pcb_trace_uncoupled_length_error = base_circuit_json_error.extend({
  type: z.literal("pcb_trace_uncoupled_length_error"),
  pcb_trace_uncoupled_length_error_id: getZodPrefixedIdWithDefault(
    "pcb_trace_uncoupled_length_error",
  ),
  error_type: z
    .literal("pcb_trace_uncoupled_length_error")
    .default("pcb_trace_uncoupled_length_error"),
  source_trace_id: z.string(),
  coupled_source_trace_id: z.string(),
  pcb_trace_ids: z.array(z.string()),
  actual_uncoupled_length: z.number().nonnegative().finite(),
  maximum_uncoupled_length: z.number().nonnegative().finite(),
  subcircuit_id: z.string().optional(),
})

export type PcbTraceUncoupledLengthErrorInput = z.input<
  typeof pcb_trace_uncoupled_length_error
>
expectTypesMatch<
  PcbTraceUncoupledLengthError,
  z.infer<typeof pcb_trace_uncoupled_length_error>
>(true)
