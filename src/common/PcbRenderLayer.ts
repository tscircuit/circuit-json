import { all_layers, type LayerRef } from "src/pcb/properties/layer_ref"
import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export type PcbRenderLayer =
  | "top_silkscreen"
  | "bottom_silkscreen"
  | `${LayerRef}_copper`
  | "top_soldermask"
  | "bottom_soldermask"
  | "top_fabrication_note"
  | "bottom_fabrication_note"
  | "top_user_note"
  | "bottom_user_note"
  | "top_courtyard"
  | "bottom_courtyard"
  | "edge_cuts"
  | "drill"

export const pcbRenderLayer = z.enum([
  "top_silkscreen",
  "bottom_silkscreen",
  ...all_layers.map((layer) => `${layer}_copper` as const),
  "top_soldermask",
  "bottom_soldermask",
  "top_fabrication_note",
  "bottom_fabrication_note",
  "top_user_note",
  "bottom_user_note",
  "top_courtyard",
  "bottom_courtyard",
  "edge_cuts",
  "drill",
])

type InferredPcbRenderLayer = z.infer<typeof pcbRenderLayer>

expectTypesMatch<PcbRenderLayer, InferredPcbRenderLayer>(true)
