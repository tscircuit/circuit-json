import { z } from "zod"
import { distance } from "../units"

export const pcb_text = z
  .object({
    type: z.literal("pcb_text"),
    text: z.string(),
    x: distance,
    y: distance,
    align: z.enum(["bottom-left"]),
    width: distance,
    height: distance,
    lines: z.number(),
  })
  .describe("Defines text on the PCB")

export type PCBTextInput = z.input<typeof pcb_text>
export type PCBText = z.infer<typeof pcb_text>
