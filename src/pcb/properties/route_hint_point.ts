import { z } from "zod"
import { distance } from "../../units"
import { layer_ref } from "./layer_ref"

export const route_hint_point = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  to_layer: layer_ref,
})

export type RouteHintPoint = z.infer<typeof route_hint_point>
export type RouteHintPointInput = z.input<typeof route_hint_point>
