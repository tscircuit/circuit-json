import { z } from "zod"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_smtpad_circle = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("circle"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  radius: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})

const pcb_smtpad_rect = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  rect_border_radius: z.number().optional(),
  corner_radius: length.optional(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})

const pcb_smtpad_rotated_rect = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rotated_rect"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  rect_border_radius: z.number().optional(),
  corner_radius: length.optional(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})

export const pcb_smtpad_pill = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  radius: z.number(),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})
const pcb_smtpad_rotated_pill = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("rotated_pill"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  radius: z.number(),
  ccw_rotation: rotation,
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})

const pcb_smtpad_polygon = z.object({
  type: z.literal("pcb_smtpad"),
  shape: z.literal("polygon"),
  pcb_smtpad_id: getZodPrefixedIdWithDefault("pcb_smtpad"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  points: z.array(point),
  layer: layer_ref,
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  is_covered_with_solder_mask: z.boolean().optional(),
})

export const pcb_smtpad = z
  .discriminatedUnion("shape", [
    pcb_smtpad_circle,
    pcb_smtpad_rect,
    pcb_smtpad_rotated_rect,
    pcb_smtpad_rotated_pill,
    pcb_smtpad_pill,
    pcb_smtpad_polygon,
  ])
  .describe("Defines an SMT pad on the PCB")

export type PCBSMTPadInput = z.input<typeof pcb_smtpad>
type PCBSMTPadCircle = z.infer<typeof pcb_smtpad_circle>
type PCBSMTPadRect = z.infer<typeof pcb_smtpad_rect>
type PCBSMTPadRotatedRect = z.infer<typeof pcb_smtpad_rotated_rect>
type PCBSMTPadRotatedPill = z.infer<typeof pcb_smtpad_rotated_pill>
type PCBSMTPadPill = z.infer<typeof pcb_smtpad_pill>
type PCBSMTPadPolygon = z.infer<typeof pcb_smtpad_polygon>

/**
 * Defines a circular SMT pad on the PCB
 */
export interface PcbSmtPadCircle {
  type: "pcb_smtpad"
  shape: "circle"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}

/**
 * Defines a rectangular SMT pad on the PCB
 */
export interface PcbSmtPadRect {
  type: "pcb_smtpad"
  shape: "rect"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  rect_border_radius?: number
  corner_radius?: Length
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}

/**
 * Defines a rotated rectangular SMT pad on the PCB
 */
export interface PcbSmtPadRotatedRect {
  type: "pcb_smtpad"
  shape: "rotated_rect"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  rect_border_radius?: number
  corner_radius?: Length
  ccw_rotation: Rotation
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}
/**
 * Defines a pill-shaped SMT pad on the PCB (rounded rectangle).
 */
export interface PcbSmtPadPill {
  type: "pcb_smtpad"
  shape: "pill"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  radius: number
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}

/**
 * Defines a rotated pill-shaped SMT pad on the PCB
 */
export interface PcbSmtPadRotatedPill {
  type: "pcb_smtpad"
  shape: "rotated_pill"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  radius: number
  ccw_rotation: Rotation
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}

/**
 * Defines a polygonal SMT pad on the PCB
 */
export interface PcbSmtPadPolygon {
  type: "pcb_smtpad"
  shape: "polygon"
  pcb_smtpad_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  points: Point[]
  layer: LayerRef
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  is_covered_with_solder_mask?: boolean
}

export type PcbSmtPad =
  | PcbSmtPadCircle
  | PcbSmtPadRect
  | PcbSmtPadRotatedRect
  | PcbSmtPadRotatedPill
  | PcbSmtPadPill
  | PcbSmtPadPolygon

/**
 * @deprecated use PcbSmtPad
 */
export type PCBSMTPad = PcbSmtPad

expectTypesMatch<PcbSmtPadCircle, PCBSMTPadCircle>(true)
expectTypesMatch<PcbSmtPadRect, PCBSMTPadRect>(true)
expectTypesMatch<PcbSmtPadRotatedRect, PCBSMTPadRotatedRect>(true)
expectTypesMatch<PcbSmtPadRotatedPill, PCBSMTPadRotatedPill>(true)
expectTypesMatch<PcbSmtPadPill, PCBSMTPadPill>(true)
expectTypesMatch<PcbSmtPadPolygon, PCBSMTPadPolygon>(true)
