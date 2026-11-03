import { z } from "zod"
import type { Point } from "../common/point"
import { expectTypesMatch } from "../utils/expect-types-match"
import { system_block_id, system_block_point } from "./geometry"

export const system_block_connection = z
  .object({
    type: z.literal("system_block_connection"),
    system_block_connection_id: system_block_id,
    system_block_page_id: system_block_id,
    name: system_block_id.optional(),
    from_system_block_component_id: system_block_id,
    to_system_block_component_id: system_block_id,
    kind: z.enum(["signal", "power"]),
    direction: z.enum(["forward", "both", "none"]),
    route: z
      .array(system_block_point)
      .min(2)
      .refine(
        (route) =>
          route.every(
            (point, index) =>
              index === 0 ||
              point.x !== route[index - 1]!.x ||
              point.y !== route[index - 1]!.y,
          ),
        "Consecutive route points must be distinct",
      ),
    label: z.string().optional(),
    label_center: system_block_point.optional(),
  })
  .refine(
    (connection) =>
      connection.label === undefined || connection.label_center !== undefined,
    {
      message: "A connection label requires a resolved label_center",
      path: ["label_center"],
    },
  )
  .describe(
    "A logical relationship with a resolved polyline from the source block boundary to the target block boundary. Route and label center use page-centered diagram mm. Does not create an electrical trace.",
  )

/** A logical interface with resolved route and label placement. */
export interface SystemBlockConnection {
  type: "system_block_connection"
  system_block_connection_id: string
  system_block_page_id: string
  name?: string
  from_system_block_component_id: string
  to_system_block_component_id: string
  kind: "signal" | "power"
  /** Forward draws an arrow at the route's end; both draws at both ends. */
  direction: "forward" | "both" | "none"
  /** Ordered page-local points from source to target; at least two, no zero-length segments. */
  route: Point[]
  label?: string
  /** Required when label is supplied. Center of horizontal text in page-local mm. */
  label_center?: Point
}

export type SystemBlockConnectionInput = z.input<typeof system_block_connection>
expectTypesMatch<
  SystemBlockConnection,
  z.infer<typeof system_block_connection>
>(true)
