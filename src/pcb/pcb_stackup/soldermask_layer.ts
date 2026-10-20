import { type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { positive_length, positive_number } from "./validators"

export const pcb_stackup_soldermask_layer = z.object({
  layer_type: z.literal("soldermask").describe("Soldermask layer"),
  thickness: positive_length.optional().describe("Soldermask thickness in mm"),
  relative_permittivity: positive_number
    .optional()
    .describe("Soldermask relative permittivity"),
})

/** A soldermask layer in the physical board stack. */
export interface PcbSoldermaskStackupLayer {
  layer_type: "soldermask"
  /** Soldermask thickness in mm. */
  thickness?: Length
  /** Relative permittivity of the soldermask. */
  relative_permittivity?: number
}
expectTypesMatch<
  PcbSoldermaskStackupLayer,
  z.infer<typeof pcb_stackup_soldermask_layer>
>(true)
