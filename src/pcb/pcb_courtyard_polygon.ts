import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
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
  color?: string
}

/**
 * @deprecated use PcbCourtyardPolygon
 */
export type PCBCourtyardPolygon = PcbCourtyardPolygon

expectTypesMatch<PcbCourtyardPolygon, InferredPcbCourtyardPolygon>(true)
