import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type Point, point } from "../common"
import { distance } from "../units"

const pcb_keepout_base = z.object({
  type: z.literal("pcb_keepout"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  pcb_keepout_id: z.string(),
  layers: z.array(z.string()),
  description: z.string().optional(),
  excluded_pcb_component_ids: z.array(z.string()).optional(),
})

export const pcb_keepout_rect = pcb_keepout_base.extend({
  shape: z.literal("rect"),
  center: point,
  width: distance,
  height: distance,
})

export const pcb_keepout_circle = pcb_keepout_base.extend({
  shape: z.literal("circle"),
  center: point,
  radius: distance,
})

export const pcb_keepout_path = pcb_keepout_base.extend({
  shape: z.literal("path"),
  route: z.array(point).min(2),
  stroke_width: distance,
})

export const pcb_keepout = z.discriminatedUnion("shape", [
  pcb_keepout_rect,
  pcb_keepout_circle,
  pcb_keepout_path,
])

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
  /** PCB components excluded from keepout DRC enforcement. */
  excluded_pcb_component_ids?: string[]
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
  /** PCB components excluded from keepout DRC enforcement. */
  excluded_pcb_component_ids?: string[]
}

export interface PCBKeepoutPath {
  type: "pcb_keepout"
  shape: "path"
  pcb_group_id?: string
  subcircuit_id?: string
  route: Point[]
  stroke_width: number
  pcb_keepout_id: string
  layers: string[]
  description?: string
  /** PCB components excluded from keepout DRC enforcement. */
  excluded_pcb_component_ids?: string[]
}

export type PCBKeepout = PCBKeepoutRect | PCBKeepoutCircle | PCBKeepoutPath

expectTypesMatch<PCBKeepout, InferredPCBKeepout>(true)
