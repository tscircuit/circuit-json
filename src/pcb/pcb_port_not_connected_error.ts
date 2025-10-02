import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const pcb_port_not_connected_error = z
  .object({
    type: z.literal("pcb_port_not_connected_error"),
    pcb_port_not_connected_error_id: getZodPrefixedIdWithDefault(
      "pcb_port_not_connected_error",
    ),
    error_type: z
      .literal("pcb_port_not_connected_error")
      .default("pcb_port_not_connected_error"),
    message: z.string(),
    pcb_port_ids: z.array(z.string()),
    pcb_component_ids: z.array(z.string()),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines an error when a pcb port is not connected to any trace")

export type PcbPortNotConnectedErrorInput = z.input<
  typeof pcb_port_not_connected_error
>
type InferredPcbPortNotConnectedError = z.infer<
  typeof pcb_port_not_connected_error
>

/**
 * Defines an error when a pcb port is not connected to any trace
 */
export interface PcbPortNotConnectedError {
  type: "pcb_port_not_connected_error"
  pcb_port_not_connected_error_id: string
  error_type: "pcb_port_not_connected_error"
  message: string
  pcb_port_ids: string[]
  pcb_component_ids: string[]
  subcircuit_id?: string
}

expectTypesMatch<PcbPortNotConnectedError, InferredPcbPortNotConnectedError>(
  true,
)
