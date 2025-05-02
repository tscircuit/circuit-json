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

const pcb_solder_paste_oval = z.object({
  type: z.literal("pcb_solder_paste"),
  shape: z.literal("oval"),
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

export const pcb_solder_paste = z
  .union([
    pcb_solder_paste_circle,
    pcb_solder_paste_rect,
    pcb_solder_paste_pill,
    pcb_solder_paste_rotated_rect,
    pcb_solder_paste_oval,
  ])
  .describe("Defines solderpaste on the PCB")

export type PCBSolderPasteInput = z.input<typeof pcb_solder_paste>
type InferredPcbSolderPasteCircle = z.infer<typeof pcb_solder_paste_circle>
type InferredPcbSolderPasteRect = z.infer<typeof pcb_solder_paste_rect>
type InferredPcbSolderPastePill = z.infer<typeof pcb_solder_paste_pill>
type InferredPcbSolderPasteRotatedRect = z.infer<
  typeof pcb_solder_paste_rotated_rect
>
type InferredPcbSolderPasteOval = z.infer<typeof pcb_solder_paste_oval>

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
export interface PcbSolderPasteOval {
  type: "pcb_solder_paste"
  shape: "oval"
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

export type PcbSolderPaste =
  | PcbSolderPasteCircle
  | PcbSolderPasteRect
  | PcbSolderPastePill
  | PcbSolderPasteRotatedRect
  | PcbSolderPasteOval

expectTypesMatch<PcbSolderPasteCircle, InferredPcbSolderPasteCircle>(true)
expectTypesMatch<PcbSolderPasteRect, InferredPcbSolderPasteRect>(true)
expectTypesMatch<PcbSolderPastePill, InferredPcbSolderPastePill>(true)
expectTypesMatch<PcbSolderPasteRotatedRect, InferredPcbSolderPasteRotatedRect>(
  true,
)
expectTypesMatch<PcbSolderPasteOval, InferredPcbSolderPasteOval>(true)
