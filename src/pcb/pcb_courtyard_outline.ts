import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_outline = z
  .object({
    type: z.literal("pcb_courtyard_outline"),
    pcb_courtyard_outline_id: getZodPrefixedIdWithDefault(
      "pcb_courtyard_outline",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: visible_layer,
    outline: z.array(point).min(2),
    stroke_width: length.default("0.1mm"),
    is_closed: z.boolean().optional(),
    is_stroke_dashed: z.boolean().optional(),
    color: z.string().optional(),
  })
  .describe("Defines a courtyard outline on the PCB")

export type PcbCourtyardOutlineInput = z.input<typeof pcb_courtyard_outline>
type InferredPcbCourtyardOutline = z.infer<typeof pcb_courtyard_outline>

/**
 * Defines a courtyard outline on the PCB
 */
export interface PcbCourtyardOutline {
  type: "pcb_courtyard_outline"
  pcb_courtyard_outline_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  outline: Point[]
  stroke_width: Length
  is_closed?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

/**
 * @deprecated use PcbCourtyardOutline
 */
export type PCBCourtyardOutline = PcbCourtyardOutline

expectTypesMatch<PcbCourtyardOutline, InferredPcbCourtyardOutline>(true)
