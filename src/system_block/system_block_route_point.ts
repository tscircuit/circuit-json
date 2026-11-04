import { z } from "zod"
import type { Point } from "../common/point"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_point } from "./geometry"

export const system_block_route_point = system_block_point.extend({
  cubic_bezier_control_points: z
    .tuple([system_block_point, system_block_point])
    .optional(),
})

/** A resolved route endpoint in absolute page-local diagram mm. */
export interface SystemBlockRoutePoint extends Point {
  /**
   * Controls the cubic segment arriving from the previous endpoint, in departure
   * then arrival order. Omit for a straight segment; forbidden on the first point.
   * Both controls use the same absolute coordinates as the endpoints.
   */
  cubic_bezier_control_points?: [Point, Point]
}

export type SystemBlockRoutePointInput = z.input<
  typeof system_block_route_point
>
expectTypesMatch<
  SystemBlockRoutePoint,
  z.infer<typeof system_block_route_point>
>(true)
