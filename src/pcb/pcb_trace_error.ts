import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_trace_error"),
    pcb_trace_error_id: getZodPrefixedIdWithDefault("pcb_trace_error"),
    error_type: z.literal("pcb_trace_error").default("pcb_trace_error"),
    center: point.optional(),
    pcb_trace_id: z.string(),
    source_trace_id: z.string(),
    pcb_component_ids: z.array(z.string()),
    pcb_port_ids: z.array(z.string()),
    source_bus_id: z.string().optional(),
    routing_rule: z.string().optional(),
    actual_value: z.number().finite().optional(),
    expected_min: z.number().finite().optional(),
    expected_max: z.number().finite().optional(),
    units: z.enum(["mm", "ohm", "count"]).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a trace error on the PCB")

export type PcbTraceErrorInput = z.input<typeof pcb_trace_error>
type InferredPcbTraceError = z.infer<typeof pcb_trace_error>

/**
 * Defines a trace error on the PCB
 */
export interface PcbTraceError extends BaseCircuitJsonError {
  type: "pcb_trace_error"
  pcb_trace_error_id: string
  error_type: "pcb_trace_error"
  center?: Point
  pcb_trace_id: string
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
  /** Optional routing-rule context; references are not user-facing labels. */
  source_bus_id?: string
  routing_rule?: string
  actual_value?: number
  expected_min?: number
  expected_max?: number
  units?: "mm" | "ohm" | "count"
  subcircuit_id?: string
}

/**
 * @deprecated use PcbTraceError
 */
export type PCBTraceError = PcbTraceError

expectTypesMatch<PcbTraceError, InferredPcbTraceError>(true)
