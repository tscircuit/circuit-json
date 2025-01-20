import { z } from "zod"
import { point } from "../common"
import { distance } from "../units"

export const pcb_keepout = z
  .object({
    type: z.literal("pcb_keepout"),
    shape: z.literal("rect"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    width: distance,
    height: distance,
    pcb_keepout_id: z.string(),
    layers: z.array(z.string()), // Specify layers where the keepout applies
    description: z.string().optional(), // Optional description of the keepout
  })
  .or(
    z.object({
      type: z.literal("pcb_keepout"),
      shape: z.literal("circle"),
      pcb_group_id: z.string().optional(),
      subcircuit_id: z.string().optional(),
      center: point,
      radius: distance,
      pcb_keepout_id: z.string(),
      layers: z.array(z.string()), // Specify layers where the keepout applies
      description: z.string().optional(), // Optional description of the keepout
    }),
  )

export type PCBKeepoutInput = z.input<typeof pcb_keepout>
export type PCBKeepout = z.infer<typeof pcb_keepout>
