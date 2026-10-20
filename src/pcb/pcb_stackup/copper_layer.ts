import { type LayerRef, layer_ref } from "src/pcb/properties/layer_ref"
import { type Length } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  nonnegative_length,
  positive_length,
  positive_number,
} from "./validators"

export const pcb_stackup_copper_layer = z.object({
  layer_type: z.literal("copper").describe("Copper layer"),
  layer: layer_ref.describe("PCB copper layer name"),
  thickness: positive_length.describe("Copper thickness in mm"),
  conductivity: positive_number
    .optional()
    .describe(
      "Electrical conductivity in S/m; use 5.8e7 for annealed copper when omitted",
    ),
  copper_weight_oz: positive_number
    .optional()
    .describe("Copper weight in oz/ft²"),
  surface_roughness: nonnegative_length
    .optional()
    .describe("RMS copper surface roughness in mm"),
})

/** A conductive layer in the physical board stack. */
export interface PcbCopperStackupLayer {
  layer_type: "copper"
  /** PCB copper layer name, such as top, inner1, or bottom. */
  layer: LayerRef
  /** Copper thickness in mm. */
  thickness: Length
  /** Conductivity in S/m; consumers may use annealed copper 5.8e7 when omitted. */
  conductivity?: number
  /** Copper weight in oz/ft². */
  copper_weight_oz?: number
  /** RMS copper surface roughness in mm. */
  surface_roughness?: Length
}
expectTypesMatch<
  PcbCopperStackupLayer,
  z.infer<typeof pcb_stackup_copper_layer>
>(true)
