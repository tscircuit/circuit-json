import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

/** An unexpected runtime failure while generating or validating a circuit. */
export const source_runtime_error = base_circuit_json_error
  .extend({
    type: z.literal("source_runtime_error"),
    source_runtime_error_id: getZodPrefixedIdWithDefault(
      "source_runtime_error",
    ),
    error_type: z
      .literal("source_runtime_error")
      .default("source_runtime_error"),
    phase: z.string().optional(),
    check_name: z.string().optional(),
    cause: z.string(),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "An unexpected runtime failure while generating or validating a circuit",
  )

export type SourceRuntimeErrorInput = z.input<typeof source_runtime_error>
export interface SourceRuntimeError extends BaseCircuitJsonError {
  type: "source_runtime_error"
  source_runtime_error_id: string
  error_type: "source_runtime_error"
  phase?: string
  check_name?: string
  cause: string
  pcb_board_id?: string
  subcircuit_id?: string
}
expectTypesMatch<SourceRuntimeError, z.infer<typeof source_runtime_error>>(true)
