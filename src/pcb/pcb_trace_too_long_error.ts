import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  capacitor_connection,
  trace_max_length_origin,
  type CapacitorConnection,
  type TraceMaxLengthOrigin,
} from "../source/properties/trace_length_constraint"

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
    actual_trace_length_is_lower_bound: z.boolean().optional(),
    maximum_trace_length: distance,
    subcircuit_id: z.string().optional(),
    max_length_origin: trace_max_length_origin.optional(),
    capacitor_connection: capacitor_connection.optional(),
    path_pcb_trace_ids: z.array(z.string()).optional(),
    path_pcb_via_ids: z.array(z.string()).optional(),
    measurement_method: z
      .enum([
        "shortest_copper_path",
        "authored_route_length",
        "copper_path_lower_bound",
      ])
      .optional(),
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
  /** When true, the measured distance is a minimum; unresolved depth can only
   * increase it. The total path length remains indeterminate. */
  actual_trace_length_is_lower_bound?: boolean
  maximum_trace_length: Distance
  subcircuit_id?: string
  max_length_origin?: TraceMaxLengthOrigin
  capacitor_connection?: CapacitorConnection
  path_pcb_trace_ids?: string[]
  path_pcb_via_ids?: string[]
  measurement_method?:
    | "shortest_copper_path"
    | "authored_route_length"
    | "copper_path_lower_bound"
}

expectTypesMatch<PcbTraceTooLongError, InferredPcbTraceTooLongError>(true)
