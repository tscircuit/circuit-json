import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_error = z
  .object({
    type: z.literal("pcb_trace_error"),
    pcb_trace_error_id: getZodPrefixedIdWithDefault("pcb_trace_error"),
    error_type: z.literal("pcb_trace_error").default("pcb_trace_error"),
    message: z.string(),
    center: point.optional(),
    pcb_trace_id: z.string(),
    source_trace_id: z.string(),
    pcb_component_ids: z.array(z.string()),
    pcb_port_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a trace error on the PCB")

export type PcbTraceErrorInput = z.input<typeof pcb_trace_error>
type InferredPcbTraceError = z.infer<typeof pcb_trace_error>

/**
 * Defines a trace error on the PCB
 */
export interface PcbTraceError {
  type: "pcb_trace_error"
  pcb_trace_error_id: string
  error_type: "pcb_trace_error"
  message: string
  center?: Point
  pcb_trace_id: string
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
  subcircuit_id?: string
}

/**
 * @deprecated use PcbTraceError
 */
export type PCBTraceError = PcbTraceError

expectTypesMatch<PcbTraceError, InferredPcbTraceError>(true)
