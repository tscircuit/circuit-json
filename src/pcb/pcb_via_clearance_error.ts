import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_via_clearance_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_via_clearance_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
    error_type: z
      .literal("pcb_via_clearance_error")
      .default("pcb_via_clearance_error"),
    pcb_via_ids: z.array(z.string()).min(2),
    minimum_clearance: distance.optional(),
    actual_clearance: distance.optional(),
    pcb_center: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
      })
      .optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Error emitted when vias are closer than the allowed clearance")

export type PcbViaClearanceErrorInput = z.input<typeof pcb_via_clearance_error>
type InferredPcbViaClearanceError = z.infer<typeof pcb_via_clearance_error>

/** Error emitted when vias are closer than the allowed clearance */
export interface PcbViaClearanceError extends BaseCircuitJsonError {
  type: "pcb_via_clearance_error"
  pcb_error_id: string
  error_type: "pcb_via_clearance_error"
  pcb_via_ids: string[]
  minimum_clearance?: Distance
  actual_clearance?: Distance
  pcb_center?: {
    x?: number
    y?: number
  }
  subcircuit_id?: string
}

expectTypesMatch<PcbViaClearanceError, InferredPcbViaClearanceError>(true)
