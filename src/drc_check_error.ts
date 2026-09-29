import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "./base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "./common"
import { expectTypesMatch } from "./utils/expect-types-match"

/** A check failed to execute; this means validation is incomplete, not that a design rule was violated. */
export const drc_check_error = base_circuit_json_error
  .extend({
    type: z.literal("drc_check_error"),
    drc_check_error_id: getZodPrefixedIdWithDefault("drc_check_error"),
    error_type: z.literal("drc_check_error").default("drc_check_error"),
    check_name: z.string(),
    cause: z.string(),
    pcb_board_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "A DRC check or check group could not complete; validation is incomplete",
  )

export type DrcCheckErrorInput = z.input<typeof drc_check_error>
export interface DrcCheckError extends BaseCircuitJsonError {
  type: "drc_check_error"
  drc_check_error_id: string
  error_type: "drc_check_error"
  check_name: string
  cause: string
  pcb_board_id?: string
  subcircuit_id?: string
}
expectTypesMatch<DrcCheckError, z.infer<typeof drc_check_error>>(true)
