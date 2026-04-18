import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_pad_trace_clearance_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_pad_trace_clearance_error"),
    pcb_pad_trace_clearance_error_id: getZodPrefixedIdWithDefault(
      "pcb_pad_trace_clearance_error",
    ),
    error_type: z
      .literal("pcb_pad_trace_clearance_error")
      .default("pcb_pad_trace_clearance_error"),
    pcb_pad_id: z.string(),
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
  .describe("Error emitted when a pad and trace are closer than allowed clearance")

export type PcbPadTraceClearanceErrorInput = z.input<
  typeof pcb_pad_trace_clearance_error
>
type InferredPcbPadTraceClearanceError = z.infer<
  typeof pcb_pad_trace_clearance_error
>

/** Error emitted when a pad and trace are closer than allowed clearance */
export interface PcbPadTraceClearanceError extends BaseCircuitJsonError {
  type: "pcb_pad_trace_clearance_error"
  pcb_pad_trace_clearance_error_id: string
  error_type: "pcb_pad_trace_clearance_error"
  pcb_pad_id: string
  pcb_trace_id: string
  minimum_clearance?: Distance
  actual_clearance?: Distance
  center?: {
    x?: number
    y?: number
  }
  subcircuit_id?: string
}

expectTypesMatch<PcbPadTraceClearanceError, InferredPcbPadTraceClearanceError>(
  true,
)
