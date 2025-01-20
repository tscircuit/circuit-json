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

export const pcb_solder_paste = z
  .union([pcb_solder_paste_circle, pcb_solder_paste_rect])
  .describe("Defines solderpaste on the PCB")

export type PCBSolderPasteInput = z.input<typeof pcb_solder_paste>
type InferredPcbSolderPasteCircle = z.infer<typeof pcb_solder_paste_circle>
type InferredPcbSolderPasteRect = z.infer<typeof pcb_solder_paste_rect>

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

export type PcbSolderPaste = PcbSolderPasteCircle | PcbSolderPasteRect

expectTypesMatch<PcbSolderPasteCircle, InferredPcbSolderPasteCircle>(true)
expectTypesMatch<PcbSolderPasteRect, InferredPcbSolderPasteRect>(true)
