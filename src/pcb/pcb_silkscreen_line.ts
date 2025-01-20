import { z } from "zod"
import { distance, type Distance } from "src/units"
import {
  layer_ref,
  type LayerRef,
  type VisibleLayer,
  visible_layer,
} from "src/pcb/properties/layer_ref"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_silkscreen_line = z
  .object({
    type: z.literal("pcb_silkscreen_line"),
    pcb_silkscreen_line_id: getZodPrefixedIdWithDefault("pcb_silkscreen_line"),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    stroke_width: distance.default("0.1mm"),
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    layer: visible_layer,
  })
  .describe("Defines a silkscreen line on the PCB")

export type PcbSilkscreenLineInput = z.input<typeof pcb_silkscreen_line>
type InferredPcbSilkscreenLine = z.infer<typeof pcb_silkscreen_line>

/**
 * Defines a silkscreen line on the PCB
 */
export interface PcbSilkscreenLine {
  type: "pcb_silkscreen_line"
  pcb_silkscreen_line_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  stroke_width: Distance
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  layer: VisibleLayer
}

/**
 * @deprecated use PcbSilkscreenLine
 */
export type PCBSilkscreenLine = PcbSilkscreenLine

expectTypesMatch<PcbSilkscreenLine, InferredPcbSilkscreenLine>(true)
