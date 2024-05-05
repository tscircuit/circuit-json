import { z } from "zod"
import { distance } from "../units"

export const pcb_hole = z
  .object({
    type: z.literal("pcb_hole"),
    hole_diameter: z.number(),
    x: distance,
    y: distance,
  })
  .describe("Defines a hole on the PCB")

export type PCBHoleInput = z.input<typeof pcb_hole>
export type PCBHole = z.infer<typeof pcb_hole>
