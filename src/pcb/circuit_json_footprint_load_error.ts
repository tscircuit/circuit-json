import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const circuit_json_footprint_load_error = base_circuit_json_error
  .extend({
    type: z.literal("circuit_json_footprint_load_error"),
    circuit_json_footprint_load_error_id: getZodPrefixedIdWithDefault(
      "circuit_json_footprint_load_error",
    ),
    pcb_component_id: z.string(),
    source_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    error_type: z
      .literal("circuit_json_footprint_load_error")
      .default("circuit_json_footprint_load_error"),
    circuit_json: z.array(z.any()).optional(),
  })
  .describe("Defines an error when a circuit JSON footprint fails to load")

export type CircuitJsonFootprintLoadErrorInput = z.input<
  typeof circuit_json_footprint_load_error
>
type InferredCircuitJsonFootprintLoadError = z.infer<
  typeof circuit_json_footprint_load_error
>

export interface CircuitJsonFootprintLoadError extends BaseCircuitJsonError {
  type: "circuit_json_footprint_load_error"
  circuit_json_footprint_load_error_id: string
  pcb_component_id: string
  source_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  error_type: "circuit_json_footprint_load_error"
  circuit_json?: any[]
}

expectTypesMatch<
  CircuitJsonFootprintLoadError,
  InferredCircuitJsonFootprintLoadError
>(true)
