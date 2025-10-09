import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_rect = z
  .object({
    type: z.literal("pcb_courtyard_rect"),
    pcb_courtyard_rect_id: getZodPrefixedIdWithDefault("pcb_courtyard_rect"),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    center: point,
    width: length,
    height: length,
    layer: visible_layer,
    stroke_width: length.default("0.1mm"),
    is_filled: z.boolean().optional(),
    has_stroke: z.boolean().optional(),
    is_stroke_dashed: z.boolean().optional(),
    color: z.string().optional(),
  })
  .describe("Defines a courtyard rectangle on the PCB")

export type PcbCourtyardRectInput = z.input<typeof pcb_courtyard_rect>
type InferredPcbCourtyardRect = z.infer<typeof pcb_courtyard_rect>

/**
 * Defines a courtyard rectangle on the PCB
 */
export interface PcbCourtyardRect {
  type: "pcb_courtyard_rect"
  pcb_courtyard_rect_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  center: Point
  width: Length
  height: Length
  layer: VisibleLayer
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

/**
 * @deprecated use PcbCourtyardRect
 */
export type PCBCourtyardRect = PcbCourtyardRect

expectTypesMatch<PcbCourtyardRect, InferredPcbCourtyardRect>(true)
