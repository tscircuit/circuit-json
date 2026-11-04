import { z } from "zod"
import type { Point } from "../common/point"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_id, system_block_point } from "./geometry"
import {
  system_block_route_point,
  type SystemBlockRoutePoint,
} from "./system_block_route_point"

export const system_block_connection = z
  .object({
    type: z.literal("system_block_connection"),
    system_block_connection_id: system_block_id,
    system_block_page_id: system_block_id,
    name: system_block_id.optional(),
    from_system_block_component_id: system_block_id,
    to_system_block_component_id: system_block_id,
    is_signal: z.boolean(),
    is_power: z.boolean(),
    direction: z.enum(["forward", "both", "none"]),
    route: z
      .array(system_block_route_point)
      .min(2)
      .superRefine((route, ctx) => {
        for (const [index, point] of route.entries()) {
          const controls = point.cubic_bezier_control_points
          if (index === 0) {
            if (controls !== undefined) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "The first route point must not have cubic controls",
                path: [index, "cubic_bezier_control_points"],
              })
            }
            continue
          }
          const previous = route[index - 1]!
          if (
            point.x === previous.x &&
            point.y === previous.y &&
            !controls?.some(
              (control) => control.x !== point.x || control.y !== point.y,
            )
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Route segments must not be zero length",
              path: [index],
            })
          }
        }
      }),
    label: z.string().optional(),
    label_anchor_center: system_block_point.optional(),
  })
  .refine(
    (connection) =>
      connection.label === undefined ||
      connection.label_anchor_center !== undefined,
    {
      message: "A connection label requires a resolved label_anchor_center",
      path: ["label_anchor_center"],
    },
  )
  .describe(
    "A logical relationship with a resolved route of straight or cubic Bézier segments from the source block boundary to the target block boundary. Endpoints, controls, and label center use page-centered diagram mm. Does not create an electrical trace.",
  )

/** A logical interface with resolved route and label placement. */
export interface SystemBlockConnection {
  type: "system_block_connection"
  system_block_connection_id: string
  system_block_page_id: string
  name?: string
  from_system_block_component_id: string
  to_system_block_component_id: string
  /** Independent classifications; both flags are required. */
  is_signal: boolean
  is_power: boolean
  /** Forward draws an arrow at the route's end; both draws at both ends. */
  direction: "forward" | "both" | "none"
  /** Ordered page-local endpoints from source to target; at least two, no zero-length segments. */
  route: SystemBlockRoutePoint[]
  label?: string
  /** Required when label is supplied. Center of horizontal text in page-local mm. */
  label_anchor_center?: Point
}

export type SystemBlockConnectionInput = z.input<typeof system_block_connection>
expectTypesMatch<
  SystemBlockConnection,
  z.infer<typeof system_block_connection>
>(true)
