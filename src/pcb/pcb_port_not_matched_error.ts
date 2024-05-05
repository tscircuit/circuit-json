import { z } from "zod"

export const pcb_port_not_matched_error = z
  .object({
    pcb_error_id: z.string(),
    type: z.literal("pcb_error"),
    error_type: z.literal("pcb_port_not_matched_error"),
    message: z.string(),
    pcb_component_ids: z.array(z.string()),
  })
  .describe("Defines a trace error on the PCB")

export type PCBPortNotMatchedErrorInput = z.input<
  typeof pcb_port_not_matched_error
>
export type PCBPortNotMatchedError = z.infer<typeof pcb_port_not_matched_error>
