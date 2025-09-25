import { type Point, getZodPrefixedIdWithDefault, point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_trace_missing_error = z
  .object({
    type: z.literal("pcb_trace_missing_error"),
    pcb_trace_missing_error_id: getZodPrefixedIdWithDefault(
      "pcb_trace_missing_error",
    ),
    error_type: z
      .literal("pcb_trace_missing_error")
      .default("pcb_trace_missing_error"),
    message: z.string(),
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
export interface PcbTraceMissingError {
  type: "pcb_trace_missing_error"
  pcb_trace_missing_error_id: string
  error_type: "pcb_trace_missing_error"
  message: string
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
