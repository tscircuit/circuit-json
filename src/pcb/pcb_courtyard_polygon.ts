import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_courtyard_polygon = z
  .object({
    type: z.literal("pcb_courtyard_polygon"),
    pcb_courtyard_polygon_id: getZodPrefixedIdWithDefault(
      "pcb_courtyard_polygon",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: visible_layer,
    points: z.array(point).min(3),
    stroke_width: length.default("0.1mm"),
    is_filled: z.boolean().optional(),
    has_stroke: z.boolean().optional(),
    is_stroke_dashed: z.boolean().optional(),
    color: z.string().optional(),
  })
  .describe("Defines a courtyard polygon on the PCB")

export type PcbCourtyardPolygonInput = z.input<typeof pcb_courtyard_polygon>
type InferredPcbCourtyardPolygon = z.infer<typeof pcb_courtyard_polygon>

/**
 * Defines a courtyard polygon on the PCB
 */
export interface PcbCourtyardPolygon {
  type: "pcb_courtyard_polygon"
  pcb_courtyard_polygon_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  points: Point[]
  stroke_width: Length
  is_filled?: boolean
  has_stroke?: boolean
  is_stroke_dashed?: boolean
  color?: string
}

/**
 * @deprecated use PcbCourtyardPolygon
 */
export type PCBCourtyardPolygon = PcbCourtyardPolygon

expectTypesMatch<PcbCourtyardPolygon, InferredPcbCourtyardPolygon>(true)
