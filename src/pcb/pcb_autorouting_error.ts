import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_autorouting_error = z
  .object({
    type: z.literal("pcb_autorouting_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_autorouting_error"),
    message: z.string(),
  })
  .describe("The autorouting has failed to route a portion of the board")

export type PcbAutoroutingErrorInput = z.input<typeof pcb_autorouting_error>
type PcbInferredAutoroutingError = z.infer<typeof pcb_autorouting_error>

export interface PcbAutoroutingErrorInterface {
  type: "pcb_autorouting_error"
  pcb_error_id: string
  message: string
}

export type PcbAutoroutingError = PcbAutoroutingErrorInterface

expectTypesMatch<PcbAutoroutingError, PcbInferredAutoroutingError>(true)
