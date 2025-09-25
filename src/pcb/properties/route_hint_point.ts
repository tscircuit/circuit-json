import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { distance } from "../../units"
import { type LayerRef, layer_ref } from "./layer_ref"

export const route_hint_point = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  to_layer: layer_ref.optional(),
  trace_width: distance.optional(),
})

export type RouteHintPointInput = z.input<typeof route_hint_point>
type InferredRouteHintPoint = z.infer<typeof route_hint_point>

export interface RouteHintPoint {
  x: number
  y: number
  via?: boolean
  to_layer?: LayerRef
  trace_width?: number
}

expectTypesMatch<RouteHintPoint, InferredRouteHintPoint>(true)
