import { z } from "zod"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_thtpad_circle = z.object({
  type: z.literal("pcb_thtpad"),
  shape: z.literal("circle"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  outer_diameter: z.number(),
  hole_diameter: z.number(),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_thtpad_id: getZodPrefixedIdWithDefault("pcb_thtpad"),
  soldermask_margin: z.number().optional(),
})

export interface PcbThtPadCircle {
  type: "pcb_thtpad"
  shape: "circle"
  pcb_group_id?: string
  subcircuit_id?: string
  outer_diameter: number
  hole_diameter: number
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_thtpad_id: string
  soldermask_margin?: number
}

const pcb_thtpad_rect = z.object({
  type: z.literal("pcb_thtpad"),
  shape: z.literal("rect"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  width: z.number(),
  height: z.number(),
  hole_diameter: z.number(),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_thtpad_id: getZodPrefixedIdWithDefault("pcb_thtpad"),
  soldermask_margin: z.number().optional(),
})

export interface PcbThtPadRect {
  type: "pcb_thtpad"
  shape: "rect"
  pcb_group_id?: string
  subcircuit_id?: string
  width: number
  height: number
  hole_diameter: number
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_thtpad_id: string
  soldermask_margin?: number
}

const pcb_thtpad_pill = z.object({
  type: z.literal("pcb_thtpad"),
  shape: z.literal("pill"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  width: z.number(),
  height: z.number(),
  hole_diameter: z.number(),
  is_covered_with_solder_mask: z.boolean().optional(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_thtpad_id: getZodPrefixedIdWithDefault("pcb_thtpad"),
  soldermask_margin: z.number().optional(),
  ccw_rotation: rotation.optional(),
})

export interface PcbThtPadPill {
  type: "pcb_thtpad"
  shape: "pill"
  pcb_group_id?: string
  subcircuit_id?: string
  width: number
  height: number
  hole_diameter: number
  is_covered_with_solder_mask?: boolean
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_thtpad_id: string
  soldermask_margin?: number
  ccw_rotation?: Rotation
}

export const pcb_thtpad = z.union([
  pcb_thtpad_circle,
  pcb_thtpad_rect,
  pcb_thtpad_pill,
])

export type PcbThtPad = PcbThtPadCircle | PcbThtPadRect | PcbThtPadPill

expectTypesMatch<PcbThtPadCircle, z.infer<typeof pcb_thtpad_circle>>(true)
expectTypesMatch<PcbThtPadRect, z.infer<typeof pcb_thtpad_rect>>(true)
expectTypesMatch<PcbThtPadPill, z.infer<typeof pcb_thtpad_pill>>(true)

export type PcbThtPadInput = z.input<typeof pcb_thtpad>
