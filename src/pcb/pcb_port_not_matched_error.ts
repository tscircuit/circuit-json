import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_port_not_matched_error = z
  .object({
    type: z.literal("pcb_port_not_matched_error"),
    pcb_error_id: getZodPrefixedIdWithDefault("pcb_error"),
    error_type: z
      .literal("pcb_port_not_matched_error")
      .default("pcb_port_not_matched_error"),
    message: z.string(),
    pcb_component_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a trace error on the PCB where a port is not matched")

export type PcbPortNotMatchedErrorInput = z.input<
  typeof pcb_port_not_matched_error
>
type InferredPcbPortNotMatchedError = z.infer<typeof pcb_port_not_matched_error>

/**
 * Defines a trace error on the PCB where a port is not matched
 */
export interface PcbPortNotMatchedError {
  type: "pcb_port_not_matched_error"
  pcb_error_id: string
  error_type: "pcb_port_not_matched_error"
  message: string
  pcb_component_ids: string[]
  subcircuit_id?: string
}

/**
 * @deprecated use PcbPortNotMatchedError
 */
export type PCBPortNotMatchedError = PcbPortNotMatchedError

expectTypesMatch<PcbPortNotMatchedError, InferredPcbPortNotMatchedError>(true)
