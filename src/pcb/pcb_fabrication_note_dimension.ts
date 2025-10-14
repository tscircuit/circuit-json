import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { length, type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_fabrication_note_dimension = z
  .object({
    type: z.literal("pcb_fabrication_note_dimension"),
    pcb_fabrication_note_dimension_id: getZodPrefixedIdWithDefault(
      "pcb_fabrication_note_dimension",
    ),
    pcb_component_id: z.string(),
    pcb_group_id: z.string().optional(),
    subcircuit_id: z.string().optional(),
    layer: visible_layer,
    from: point,
    to: point,
    text: z.string().optional(),
    offset: length.optional(),
    font: z.literal("tscircuit2024").default("tscircuit2024"),
    font_size: length.default("1mm"),
    color: z.string().optional(),
    arrow_size: length.default("1mm"),
  })
  .describe("Defines a measurement annotation within PCB fabrication notes")

export type PcbFabricationNoteDimensionInput = z.input<
  typeof pcb_fabrication_note_dimension
>
type InferredPcbFabricationNoteDimension = z.infer<
  typeof pcb_fabrication_note_dimension
>

/**
 * Defines a measurement annotation within PCB fabrication notes
 */
export interface PcbFabricationNoteDimension {
  type: "pcb_fabrication_note_dimension"
  pcb_fabrication_note_dimension_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  from: Point
  to: Point
  text?: string
  offset?: Length
  font: "tscircuit2024"
  font_size: Length
  color?: string
  arrow_size: Length
}

/**
 * @deprecated use PcbFabricationNoteDimension
 */
export type PCBFabricationNoteDimension = PcbFabricationNoteDimension

expectTypesMatch<
  PcbFabricationNoteDimension,
  InferredPcbFabricationNoteDimension
>(true)
