import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_placement_error = z
  .object({
    type: z.literal("pcb_placement_error"),
    pcb_placement_error_id: getZodPrefixedIdWithDefault("pcb_placement_error"),
    error_type: z.literal("pcb_placement_error").default("pcb_placement_error"),
    message: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a placement error on the PCB")

export type PcbPlacementErrorInput = z.input<typeof pcb_placement_error>
type InferredPcbPlacementError = z.infer<typeof pcb_placement_error>

/**
 * Defines a placement error on the PCB
 */
export interface PcbPlacementError {
  type: "pcb_placement_error"
  pcb_placement_error_id: string
  error_type: "pcb_placement_error"
  message: string
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPlacementError
 */
export type PCBPlacementError = PcbPlacementError

expectTypesMatch<PcbPlacementError, InferredPcbPlacementError>(true)
