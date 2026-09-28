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
  warning_only: z.boolean().optional(),
  allow_traces: z.boolean().optional(),
  allow_placements: z.boolean().optional(),
})

export const pcb_keepout_ring = z
  .object({
    type: z.literal("pcb_keepout"),
    shape: z.literal("ring"),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    inner_radius: distance,
    outer_radius: distance,
    pcb_keepout_id: z.string(),
    layers: z.array(z.string()),
    description: z.string().optional(),
    excluded_pcb_component_ids: z.array(z.string()).optional(),
    warning_only: z.boolean().optional(),
    allow_traces: z.boolean().optional(),
    allow_placements: z.boolean().optional(),
  })
  .refine(
    ({ inner_radius, outer_radius }) =>
      inner_radius > 0 && outer_radius > inner_radius,
    { message: "Ring keepout requires 0 < inner_radius < outer_radius" },
  )

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
    warning_only: z.boolean().optional(),
    allow_traces: z.boolean().optional(),
    allow_placements: z.boolean().optional(),
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
      warning_only: z.boolean().optional(),
      allow_traces: z.boolean().optional(),
      allow_placements: z.boolean().optional(),
    }),
  )
  .or(pcb_keepout_outline)
  .or(pcb_keepout_ring)

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
  /**
   * When true, this keepout is advisory: it does not block routing or copper
   * placement, and DRC reports overlaps as pcb_keepout_overlap_warning records.
   * False or omitted preserves normal enforcement. Component exclusions still apply.
   */
  warning_only?: boolean
  /** Allow trace crossings without keepout diagnostics; copper pours remain excluded. */
  allow_traces?: boolean
  /** Allow components and their pads/plated holes without keepout diagnostics; copper pours remain excluded. */
  allow_placements?: boolean
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
  /**
   * When true, this keepout is advisory: it does not block routing or copper
   * placement, and DRC reports overlaps as pcb_keepout_overlap_warning records.
   * False or omitted preserves normal enforcement. Component exclusions still apply.
   */
  warning_only?: boolean
  /** Allow trace crossings without keepout diagnostics; copper pours remain excluded. */
  allow_traces?: boolean
  /** Allow components and their pads/plated holes without keepout diagnostics; copper pours remain excluded. */
  allow_placements?: boolean
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
  /**
   * When true, this keepout is advisory: it does not block routing or copper
   * placement, and DRC reports overlaps as pcb_keepout_overlap_warning records.
   * False or omitted preserves normal enforcement. Component exclusions still apply.
   */
  warning_only?: boolean
  /** Allow trace crossings without keepout diagnostics; copper pours remain excluded. */
  allow_traces?: boolean
  /** Allow components and their pads/plated holes without keepout diagnostics; copper pours remain excluded. */
  allow_placements?: boolean
}

export interface PcbKeepoutRing {
  type: "pcb_keepout"
  shape: "ring"
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  inner_radius: number
  outer_radius: number
  pcb_keepout_id: string
  layers: string[]
  description?: string
  excluded_pcb_component_ids?: string[]
  warning_only?: boolean
  allow_traces?: boolean
  allow_placements?: boolean
}

expectTypesMatch<PcbKeepoutOutline, InferredPcbKeepoutOutline>(true)
expectTypesMatch<PcbKeepoutRing, z.infer<typeof pcb_keepout_ring>>(true)

export type PCBKeepout =
  | PCBKeepoutRect
  | PCBKeepoutCircle
  | PcbKeepoutOutline
  | PcbKeepoutRing

expectTypesMatch<PCBKeepout, InferredPCBKeepout>(true)
