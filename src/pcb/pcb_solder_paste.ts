import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef } from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_solder_paste_circle = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("circle"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  radius: z.number(),
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
  pcb_smtpad_id: z.string().optional(),
})

const pcb_solder_paste_rect = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
  pcb_smtpad_id: z.string().optional(),
})
const pcb_solder_paste_pill = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  radius: z.number(),
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
  pcb_smtpad_id: z.string().optional(),
})
const pcb_solder_paste_rotated_rect = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("rotated_rect"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  x: distance,
  y: distance,
  width: z.number(),
  height: z.number(),
  ccw_rotation: distance,
  layer: layer_ref,
  pcb_component_id: z.string().optional(),
  pcb_smtpad_id: z.string().optional(),
})
//
const pcb_solder_paste_circular_plated_hole = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("circle"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_plated_hole_id: z.string().optional(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_diameter: z.number(),
  outer_diameter: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
})
const pcb_solder_paste_pill_plated_hole = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("pill"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_plated_hole_id: z.string().optional(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_width: z.number().optional(),
  hole_height: z.number().optional(),
  outer_width: z.number(),
  outer_height: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
})
// circular_hole_with_rect_pad
const pcb_solder_paste_circular_hole_with_rect_pad = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("circular_hole_with_rect_pad"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("circle"),
  pad_shape: z.literal("rect"),
  hole_diameter: z.number(),
  rect_pad_width: z.number(),
  rect_pad_height: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: z.string().optional(),
})
const pcb_solder_paste_pill_hole_with_rect_pad = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("pill_hole_with_rect_pad"),
  pcb_solder_paste_id: getZodPrefixedIdWithDefault("pcb_solder_paste"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("pill"),
  pad_shape: z.literal("rect"),
  hole_width: z.number().optional(),
  hole_height: z.number().optional(),
  rect_pad_width: z.number(),
  rect_pad_height: z.number(),
  x: distance,
  y: distance,
  layers: z.array(layer_ref),
  port_hints: z.array(z.string()).optional(),
  pcb_component_id: z.string().optional(),
  pcb_port_id: z.string().optional(),
  pcb_plated_hole_id: z.string().optional(),
})
export const pcb_solder_paste = z
  .union([
    pcb_solder_paste_circle,
    pcb_solder_paste_rect,
    pcb_solder_paste_pill,
    pcb_solder_paste_rotated_rect,
    pcb_solder_paste_circular_plated_hole,
    pcb_solder_paste_pill_plated_hole,
    pcb_solder_paste_circular_hole_with_rect_pad,
    pcb_solder_paste_pill_hole_with_rect_pad,
  ])
  .describe("Defines solderpaste on the PCB")

export type PCBSolderPasteInput = z.input<typeof pcb_solder_paste>
type InferredPcbSolderPasteCircle = z.infer<typeof pcb_solder_paste_circle>
type InferredPcbSolderPasteRect = z.infer<typeof pcb_solder_paste_rect>
type InferredPcbSolderPastePill = z.infer<typeof pcb_solder_paste_pill>
type InferredPcbSolderPasteRotatedRect = z.infer<
  typeof pcb_solder_paste_rotated_rect
>
type InferredPcbSolderPasteCircularPlatedHole = z.infer<
  typeof pcb_solder_paste_circular_plated_hole
>
type InferredPcbSolderPastePillPlatedHole = z.infer<
  typeof pcb_solder_paste_pill_plated_hole
>
type InferredPcbSolderPasteCircularHoleWithRectPad = z.infer<
  typeof pcb_solder_paste_circular_hole_with_rect_pad
>
type InferredPcbSolderPastePillHoleWithRectPad = z.infer<
  typeof pcb_solder_paste_pill_hole_with_rect_pad
>

/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteCircle {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}

/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteRect {
  type: "pcb_solder_paste"
  shape: "rect"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPastePill {
  type: "pcb_solder_paste"
  shape: "pill"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  radius: number
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteRotatedRect {
  type: "pcb_solder_paste"
  shape: "rotated_rect"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  x: Distance
  y: Distance
  width: number
  height: number
  ccw_rotation: Distance
  layer: LayerRef
  pcb_component_id?: string
  pcb_smtpad_id?: string
}
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteCircularPlatedHole {
  type: "pcb_solder_paste"
  shape: "circle"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_diameter: number
  outer_diameter: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id?: string
}
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPastePillPlatedHole {
  type: "pcb_solder_paste"
  shape: "pill"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_width?: number
  hole_height?: number
  outer_width: number
  outer_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id?: string
}
/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPasteCircularHoleWithRectPad {
  type: "pcb_solder_paste"
  shape: "circular_hole_with_rect_pad"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle"
  pad_shape: "rect"
  hole_diameter: number
  rect_pad_width: number
  rect_pad_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id?: string
}

/**
 * Defines solderpaste on the PCB
 */
export interface PcbSolderPastePillHoleWithRectPad {
  type: "pcb_solder_paste"
  shape: "pill_hole_with_rect_pad"
  pcb_solder_paste_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "pill"
  pad_shape: "rect"
  hole_width?: number
  hole_height?: number
  rect_pad_width: number
  rect_pad_height: number
  x: Distance
  y: Distance
  layers: LayerRef[]
  port_hints?: string[]
  pcb_component_id?: string
  pcb_port_id?: string
  pcb_plated_hole_id?: string
}

/**
 * Defines solderpaste on the PCB
 */

export type PcbSolderPaste =
  | PcbSolderPasteCircle
  | PcbSolderPasteRect
  | PcbSolderPastePill
  | PcbSolderPasteRotatedRect
  | PcbSolderPasteCircularPlatedHole
  | PcbSolderPastePillPlatedHole
  | PcbSolderPasteCircularHoleWithRectPad
  | PcbSolderPastePillHoleWithRectPad
expectTypesMatch<PcbSolderPasteCircle, InferredPcbSolderPasteCircle>(true)
expectTypesMatch<PcbSolderPasteRect, InferredPcbSolderPasteRect>(true)
expectTypesMatch<PcbSolderPastePill, InferredPcbSolderPastePill>(true)
expectTypesMatch<PcbSolderPasteRotatedRect, InferredPcbSolderPasteRotatedRect>(
  true,
)
expectTypesMatch<
  PcbSolderPasteCircularPlatedHole,
  InferredPcbSolderPasteCircularPlatedHole
>(true)
expectTypesMatch<
  PcbSolderPastePillPlatedHole,
  InferredPcbSolderPastePillPlatedHole
>(true)
expectTypesMatch<
  PcbSolderPasteCircularHoleWithRectPad,
  InferredPcbSolderPasteCircularHoleWithRectPad
>(true)
expectTypesMatch<
  PcbSolderPastePillHoleWithRectPad,
  InferredPcbSolderPastePillHoleWithRectPad
>(true)
