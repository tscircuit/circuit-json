import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const all_layers = [
  "top",
  "bottom",
  "inner1",
  "inner2",
  "inner3",
  "inner4",
  "inner5",
  "inner6",
] as const

export const layer_string = z.enum(all_layers)

export const layer_ref = layer_string
  .or(
    z.object({
      name: layer_string,
    }),
  )
  .transform((layer) => {
    if (typeof layer === "string") {
      return layer
    }
    return layer.name
  })

export type LayerRefInput = z.input<typeof layer_ref>
type InferredLayerRef = z.output<typeof layer_ref>
export type LayerRef = (typeof all_layers)[number]

expectTypesMatch<LayerRef, InferredLayerRef>(true)

export const visible_layer = z.enum(["top", "bottom"])
export type VisibleLayerRef = z.infer<typeof visible_layer>
export type VisibleLayer = z.infer<typeof visible_layer>
