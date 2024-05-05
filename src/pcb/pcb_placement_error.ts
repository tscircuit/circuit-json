import { z } from "zod"

export const pcb_placement_error = z
  .object({
    pcb_error_id: z.string(),
    type: z.literal("pcb_error"),
    error_type: z.literal("pcb_placement_error"),
    message: z.string(),
  })
  .describe("Defines a placement error on the PCB")

export type PCBPlacementErrorInput = z.input<typeof pcb_placement_error>
export type PCBPlacementError = z.infer<typeof pcb_placement_error>
