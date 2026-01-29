import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_missing_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_trace_missing_error"),
    pcb_trace_missing_error_id: getZodPrefixedIdWithDefault(
      "pcb_trace_missing_error",
    ),
    error_type: z
      .literal("pcb_trace_missing_error")
      .default("pcb_trace_missing_error"),
    center: point.optional(),
    source_trace_id: z.string(),
    pcb_component_ids: z.array(z.string()),
    pcb_port_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Defines an error when a source trace has no corresponding PCB trace",
  )

export type PcbTraceMissingErrorInput = z.input<typeof pcb_trace_missing_error>
type InferredPcbTraceMissingError = z.infer<typeof pcb_trace_missing_error>

/**
 * Defines an error when a source trace has no corresponding PCB trace
 */
export interface PcbTraceMissingError extends BaseCircuitJsonError {
  type: "pcb_trace_missing_error"
  pcb_trace_missing_error_id: string
  error_type: "pcb_trace_missing_error"
  center?: Point
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
  subcircuit_id?: string
}

/**
 * @deprecated use PcbTraceMissingError
 */
export type PCBTraceMissingError = PcbTraceMissingError

expectTypesMatch<PcbTraceMissingError, InferredPcbTraceMissingError>(true)
