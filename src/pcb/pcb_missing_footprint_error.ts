import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_missing_footprint_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_missing_footprint_error"),
    pcb_missing_footprint_error_id: getZodPrefixedIdWithDefault(
      "pcb_missing_footprint_error",
    ),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("pcb_missing_footprint_error")
      .default("pcb_missing_footprint_error"),
    source_component_id: z.string(),
  })
  .describe("Defines a missing footprint error on the PCB")

export type PcbMissingFootprintErrorInput = z.input<
  typeof pcb_missing_footprint_error
>
type InferredPcbMissingFootprintError = z.infer<
  typeof pcb_missing_footprint_error
>

/**
 * Defines a placement error on the PCB
 */
export interface PcbMissingFootprintError extends BaseCircuitJsonError {
  type: "pcb_missing_footprint_error"
  pcb_missing_footprint_error_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  error_type: "pcb_missing_footprint_error"
  source_component_id: string
}

/**
 * @deprecated use PcbMissingFootprintError
 */
export type PCBMissingFootprintError = PcbMissingFootprintError

expectTypesMatch<PcbMissingFootprintError, InferredPcbMissingFootprintError>(
  true,
)
