import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_autorouting_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_autorouting_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_autorouting_error"),
    error_type: z
      .literal("pcb_autorouting_error")
      .default("pcb_autorouting_error"),
    subcircuit_id: z.string().optional(),
    differential_pair_length_skew: z
      .object({
        source_bus_id: z.string(),
        positive_length: z.number().nonnegative().finite(),
        negative_length: z.number().nonnegative().finite(),
      })
      .optional(),
  })
  .describe("The autorouting has failed to route a portion of the board")

export type PcbAutoroutingErrorInput = z.input<typeof pcb_autorouting_error>
type PcbInferredAutoroutingError = z.infer<typeof pcb_autorouting_error>

/** The autorouting has failed to route a portion of the board. */
export interface PcbAutoroutingErrorInterface extends BaseCircuitJsonError {
  type: "pcb_autorouting_error"
  pcb_error_id: string
  error_type: "pcb_autorouting_error"
  subcircuit_id?: string
  /** Set when routing failed because a differential pair's lanes could not be length-matched. Lengths in mm. */
  differential_pair_length_skew?: {
    source_bus_id: string
    positive_length: number
    negative_length: number
  }
}

export type PcbAutoroutingError = PcbAutoroutingErrorInterface

expectTypesMatch<PcbAutoroutingError, PcbInferredAutoroutingError>(true)
