import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_packing_failure = base_circuit_json_error
  .extend({
    type: z.literal("pcb_packing_failure"),
    pcb_packing_failure_id: getZodPrefixedIdWithDefault("pcb_packing_failure"),
    error_type: z.literal("pcb_packing_failure").default("pcb_packing_failure"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a failure to pack PCB components within layout bounds")

export type PcbPackingFailureInput = z.input<typeof pcb_packing_failure>
type InferredPcbPackingFailure = z.infer<typeof pcb_packing_failure>

/**
 * Defines a failure to pack PCB components within layout bounds
 */
export interface PcbPackingFailure extends BaseCircuitJsonError {
  type: "pcb_packing_failure"
  pcb_packing_failure_id: string
  error_type: "pcb_packing_failure"
  pcb_group_id?: string
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPackingFailure
 */
export type PCBPackingFailure = PcbPackingFailure

expectTypesMatch<PcbPackingFailure, InferredPcbPackingFailure>(true)
