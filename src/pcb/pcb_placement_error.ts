import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_placement_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_placement_error"),
    pcb_placement_error_id: getZodPrefixedIdWithDefault("pcb_placement_error"),
    error_type: z.literal("pcb_placement_error").default("pcb_placement_error"),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a placement error on the PCB")

export type PcbPlacementErrorInput = z.input<typeof pcb_placement_error>
type InferredPcbPlacementError = z.infer<typeof pcb_placement_error>

/**
 * Defines a placement error on the PCB
 */
export interface PcbPlacementError extends BaseCircuitJsonError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  error_type: "pcb_placement_error"
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPlacementError
 */
export type PCBPlacementError = PcbPlacementError

expectTypesMatch<PcbPlacementError, InferredPcbPlacementError>(true)
