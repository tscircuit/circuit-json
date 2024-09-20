import { z } from "zod"
import { distance, type Distance } from "src/units"
import { layer_ref, type LayerRef, getZodPrefixedIdWithDefault } from "src/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_via = z
  .object({
    type: z.literal("pcb_via"),
    pcb_via_id: getZodPrefixedIdWithDefault("pcb_via"),
    x: distance,
    y: distance,
    outer_diameter: distance.default("0.6mm"),
    hole_diameter: distance.default("0.25mm"),
    /** @deprecated */
    from_layer: layer_ref.optional(),
    /** @deprecated */
    to_layer: layer_ref.optional(),
    layers: z.array(layer_ref),
  })
  .describe("Defines a via on the PCB")

export type PcbViaInput = z.input<typeof pcb_via>
type InferredPcbVia = z.infer<typeof pcb_via>

/**
 * Defines a via on the PCB
 */
export interface PcbVia {
  type: "pcb_via"
  pcb_via_id: string
  x: Distance
  y: Distance
  outer_diameter: Distance
  hole_diameter: Distance
  /** @deprecated */
  from_layer?: LayerRef
  /** @deprecated */
  to_layer?: LayerRef
  layers: LayerRef[]
}

/**
 * @deprecated use PcbVia
 */
export type PCBVia = PcbVia

expectTypesMatch<PcbVia, InferredPcbVia>(true)
