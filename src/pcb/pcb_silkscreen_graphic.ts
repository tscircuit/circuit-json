import { z } from "zod"
import { asset, type Asset, getZodPrefixedIdWithDefault } from "src/common"
import { visible_layer, type VisibleLayer } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { brep_shape, type BRepShape } from "./properties/brep"

const pcb_silkscreen_graphic_base = z.object({
  type: z.literal("pcb_silkscreen_graphic"),
  pcb_silkscreen_graphic_id: getZodPrefixedIdWithDefault(
    "pcb_silkscreen_graphic",
  ),
  pcb_component_id: z.string(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  layer: visible_layer,
  image_asset: asset.optional(),
})

export const pcb_silkscreen_graphic_brep = pcb_silkscreen_graphic_base
  .extend({
    shape: z.literal("brep"),
    brep_shape: brep_shape,
  })
  .describe("Defines a BRep silkscreen graphic on the PCB")

export type PcbSilkscreenGraphicBRepInput = z.input<
  typeof pcb_silkscreen_graphic_brep
>
type InferredPcbSilkscreenGraphicBRep = z.infer<
  typeof pcb_silkscreen_graphic_brep
>

/**
 * Defines a BRep silkscreen graphic on the PCB
 */
export interface PcbSilkscreenGraphicBRep {
  type: "pcb_silkscreen_graphic"
  pcb_silkscreen_graphic_id: string
  pcb_component_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  layer: VisibleLayer
  image_asset?: Asset
  shape: "brep"
  brep_shape: BRepShape
}
expectTypesMatch<PcbSilkscreenGraphicBRep, InferredPcbSilkscreenGraphicBRep>(
  true,
)

export const pcb_silkscreen_graphic = z
  .discriminatedUnion("shape", [pcb_silkscreen_graphic_brep])
  .describe("Defines a silkscreen graphic on the PCB")

export type PcbSilkscreenGraphicInput = z.input<typeof pcb_silkscreen_graphic>
export type PcbSilkscreenGraphic = PcbSilkscreenGraphicBRep

type InferredPcbSilkscreenGraphic = z.infer<typeof pcb_silkscreen_graphic>
expectTypesMatch<PcbSilkscreenGraphic, InferredPcbSilkscreenGraphic>(true)
