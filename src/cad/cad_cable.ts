import { z } from "zod"
import { point3, type Point3 } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

const connectorWidthDirection = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .refine(
    (direction) =>
      Math.abs(Math.hypot(direction.x, direction.y, direction.z) - 1) < 1e-5,
    "Connector width direction must be a unit vector",
  )
  .describe(
    "Connector local +X (pin-row/width) unit direction in right-handed circuit world: +X right, +Y top, +Z above. No translation or units. Perpendicular to its endpoint path tangent; fixes roll about the insertion axis.",
  )

export const cad_cable = z
  .object({
    type: z.literal("cad_cable"),
    cad_cable_id: z.string(),
    name: z.string().min(1),
    from_source_component_id: z.string(),
    to_source_component_id: z.string(),
    cableprinter_string: z
      .string()
      .min(1)
      .describe(
        'Physical cable definition, e.g. "usb_c" or "jst_ph_pins6". Independent of the route.',
      ),
    from_connector_width_direction: connectorWidthDirection.optional(),
    to_connector_width_direction: connectorWidthDirection.optional(),
    path: z
      .array(point3)
      .min(2)
      .refine(
        (path) =>
          path.every(
            (point, i) =>
              [point.x, point.y, point.z].every(Number.isFinite) &&
              (i === 0 ||
                Math.hypot(
                  point.x - path[i - 1]!.x,
                  point.y - path[i - 1]!.y,
                  point.z - path[i - 1]!.z,
                ) > 1e-8),
          ),
        "Cable paths require finite, distinct consecutive points",
      )
      .describe(
        "Resolved cable centerline points in right-handed circuit world, millimeters: +X right, +Y top, +Z above. First/last samples are connector wire exits; their tangents point into/out of the cable. Includes routing/slack; renderers must not recompute the path.",
      ),
  })
  .describe(
    "A physical assembly cable with a resolved 3D route. Several cables are independent cad_cable records, each with its own endpoints, definition and path. Does not imply electrical pin mapping.",
  )

export type CadCableInput = z.input<typeof cad_cable>
type InferredCadCable = z.infer<typeof cad_cable>

/** Resolved cable geometry in circuit-world XYZ, mm, +Z up. Path samples are
 * points; first and last are wire exits. Connector local +Z follows the outward
 * insertion direction; optional local +X directions fix roll. Absent directions
 * retain the renderer's legacy parallel-transport orientation.
 * Rendering consumes this path without rerouting or adding sag.
 */
export interface CadCable {
  type: "cad_cable"
  cad_cable_id: string
  name: string
  from_source_component_id: string
  to_source_component_id: string
  cableprinter_string: string
  from_connector_width_direction?: Point3
  to_connector_width_direction?: Point3
  path: Point3[]
}

expectTypesMatch<CadCable, InferredCadCable>(true)
