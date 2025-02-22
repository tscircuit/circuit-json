import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const autorouting_error = z
  .object({
    type: z.literal("autorouting_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("autorouting_error"),
    message: z.string(),
  })
  .describe("Defines a trace error on the PCB where a port is not matched")

export type AutoroutingErrorInput = z.input<typeof autorouting_error>
type InferredAutoroutingError = z.infer<typeof autorouting_error>

export interface AutoroutingErrorInterface {
  type: "autorouting_error"
  pcb_error_id: string
  message: string
}

export type AutoroutingError = AutoroutingErrorInterface

expectTypesMatch<AutoroutingError, InferredAutoroutingError>(true)
