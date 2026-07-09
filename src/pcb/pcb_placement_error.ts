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
    error_type: z
      .enum([
        "pcb_placement_error",
        "distance_exceeded",
        "wrong_pad_orientation",
        "decoupling_trace_too_long",
      ])
      .default("pcb_placement_error"),
    pcb_component_id: z.string().optional(),
    pcb_placement_hint_id: z.string().optional(),
    actual_distance: z.number().optional(),
    max_distance: z.number().optional(),
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
  error_type:
    | "pcb_placement_error"
    | "distance_exceeded"
    | "wrong_pad_orientation"
    | "decoupling_trace_too_long"
  pcb_component_id?: string
  pcb_placement_hint_id?: string
  actual_distance?: number
  max_distance?: number
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPlacementError
 */
export type PCBPlacementError = PcbPlacementError

expectTypesMatch<PcbPlacementError, InferredPcbPlacementError>(true)
