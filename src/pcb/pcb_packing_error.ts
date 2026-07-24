import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_packing_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_packing_error"),
    pcb_packing_error_id: getZodPrefixedIdWithDefault("pcb_packing_error"),
    error_type: z.literal("pcb_packing_error").default("pcb_packing_error"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a failure to pack PCB components within layout bounds")

export type PcbPackingErrorInput = z.input<typeof pcb_packing_error>
type InferredPcbPackingError = z.infer<typeof pcb_packing_error>

/**
 * Defines a failure to pack PCB components within layout bounds
 */
export interface PcbPackingError extends BaseCircuitJsonError {
  type: "pcb_packing_error"
  pcb_packing_error_id: string
  error_type: "pcb_packing_error"
  pcb_group_id?: string
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPackingError
 */
export type PCBPackingError = PcbPackingError

expectTypesMatch<PcbPackingError, InferredPcbPackingError>(true)
