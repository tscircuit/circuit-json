import { z } from "zod"
import { distance } from "src/units"
import { layer_ref } from "./layer_ref"

// x: string | number
// y: string | number
// via?: boolean
// via_to_layer?: string
export const pcb_route_hint = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  via_to_layer: layer_ref.optional(),
})
export const pcb_route_hints = z.array(pcb_route_hint)

export type PcbRouteHintInput = z.input<typeof pcb_route_hint>
export type PcbRouteHintsInput = z.input<typeof pcb_route_hints>
export type PcbRouteHint = z.output<typeof pcb_route_hint>
export type PcbRouteHints = z.output<typeof pcb_route_hints>
