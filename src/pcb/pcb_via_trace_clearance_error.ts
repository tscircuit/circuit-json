import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_via_trace_clearance_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_via_trace_clearance_error"),
    pcb_via_trace_clearance_error_id: getZodPrefixedIdWithDefault(
      "pcb_via_trace_clearance_error",
    ),
    error_type: z
      .literal("pcb_via_trace_clearance_error")
      .default("pcb_via_trace_clearance_error"),
    pcb_via_id: z.string(),
    pcb_trace_id: z.string(),
    minimum_clearance: distance.optional(),
    actual_clearance: distance.optional(),
    center: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
      })
      .optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a via and trace are closer than the allowed clearance",
  )

export type PcbViaTraceClearanceErrorInput = z.input<
  typeof pcb_via_trace_clearance_error
>
type InferredPcbViaTraceClearanceError = z.infer<
  typeof pcb_via_trace_clearance_error
>

/** Error emitted when a via and trace are closer than the allowed clearance */
export interface PcbViaTraceClearanceError extends BaseCircuitJsonError {
  type: "pcb_via_trace_clearance_error"
  pcb_via_trace_clearance_error_id: string
  error_type: "pcb_via_trace_clearance_error"
  pcb_via_id: string
  pcb_trace_id: string
  minimum_clearance?: Distance
  actual_clearance?: Distance
  center?: {
    x?: number
    y?: number
  }
  subcircuit_id?: string
}

expectTypesMatch<PcbViaTraceClearanceError, InferredPcbViaTraceClearanceError>(
  true,
)
