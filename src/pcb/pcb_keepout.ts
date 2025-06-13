import { z } from "zod"
import { point, type Point } from "../common"
import { distance } from "../units"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
type InferredPCBKeepout = z.infer<typeof pcb_keepout>

export interface PCBKeepoutRect {
  type: "pcb_keepout"
  shape: "rect"
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: number
  height: number
  pcb_keepout_id: string
  layers: string[]
  description?: string
}

export interface PCBKeepoutCircle {
  type: "pcb_keepout"
  shape: "circle"
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  radius: number
  pcb_keepout_id: string
  layers: string[]
  description?: string
}

export type PCBKeepout = PCBKeepoutRect | PCBKeepoutCircle

expectTypesMatch<PCBKeepout, InferredPCBKeepout>(true)
