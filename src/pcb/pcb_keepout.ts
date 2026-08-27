import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { type Point, point } from "../common"
import { distance, type Length, length } from "../units"

export const pcb_keepout_outline = z.object({
  type: z.literal("pcb_keepout"),
  shape: z.literal("outline"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  outline: z.array(point).min(2),
  stroke_width: length,
  pcb_keepout_id: z.string(),
  layers: z.array(z.string()),
  description: z.string().optional(),
  excluded_pcb_component_ids: z.array(z.string()).optional(),
})

export type PcbKeepoutOutlineInput = z.input<typeof pcb_keepout_outline>
type InferredPcbKeepoutOutline = z.infer<typeof pcb_keepout_outline>

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
    excluded_pcb_component_ids: z.array(z.string()).optional(),
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
      excluded_pcb_component_ids: z.array(z.string()).optional(),
    }),
  )
  .or(pcb_keepout_outline)

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

export interface PcbKeepoutOutline {
  type: "pcb_keepout"
  shape: "outline"
  pcb_group_id?: string
  subcircuit_id?: string
  outline: Point[]
  stroke_width: Length
  pcb_keepout_id: string
  layers: string[]
  description?: string
  /** PCB components excluded from keepout DRC enforcement. */
  excluded_pcb_component_ids?: string[]
}

expectTypesMatch<PcbKeepoutOutline, InferredPcbKeepoutOutline>(true)

export type PCBKeepout = PCBKeepoutRect | PCBKeepoutCircle | PcbKeepoutOutline

expectTypesMatch<PCBKeepout, InferredPCBKeepout>(true)
