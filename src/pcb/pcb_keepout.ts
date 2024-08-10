import { z } from "zod"
import { point } from "../common"
import { distance } from "../units"

export const pcb_keepout = z
  .object({
    type: z.literal("pcb_keepout"),
    pcb_keepout_id: z.string(),
    layer: z.array(z.string()).optional(), // Specify layers where the keepout applies
    description: z.string().optional(), // Optional description of the keepout
  })
  .and(
    z
      .object({
        shape: z.literal("rect"),
        x: distance,
        y: distance,
        width: distance,
        height: distance,
      })
      .or(
        z.object({
          shape: z.literal("circle"),
          center: point,
          radius: distance,
        }),
      ),
  )

export type PCBKeepoutInput = z.input<typeof pcb_keepout>
export type PCBKeepout = z.infer<typeof pcb_keepout>
