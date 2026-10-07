import { z } from "zod"
import { point3, type Point3 } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

const connectorPin1Position = point3
  .refine(
    (point) => [point.x, point.y, point.z].every(Number.isFinite),
    "Connector pin 1 positions must be finite",
  )
  .describe(
    "Resolved pin 1 position at the connector mating face, in right-handed circuit world, millimeters: +X right, +Y top, +Z above. An absolute point, not a direction. Computed by the circuit producer from endpoint geometry. Together with the endpoint path tangent, fixes connector roll and identifies its pin 1 side; renderers must not infer it from footprints.",
  )

export const cad_cable = z
  .object({
    type: z.literal("cad_cable"),
    cad_cable_id: z.string(),
    name: z.string().min(1),
    from_source_component_id: z.string(),
    to_source_component_id: z.string(),
    from_connector_pin1_position: connectorPin1Position.optional(),
    to_connector_pin1_position: connectorPin1Position.optional(),
    cableprinter_string: z
      .string()
      .min(1)
      .describe(
        'Physical cable definition, e.g. "usb_c" or "jst_ph_pins6". Independent of the route.',
      ),
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
 * points; first and last are wire exits. Optional pin 1 positions are absolute
 * points at the connector mating faces, resolved by the circuit producer.
 * Their transverse offsets from the endpoint centerlines fix connector roll.
 * Omitted positions preserve legacy parallel-transport orientation.
 * Rendering consumes this path without rerouting or adding sag.
 */
export interface CadCable {
  type: "cad_cable"
  cad_cable_id: string
  name: string
  from_source_component_id: string
  to_source_component_id: string
  from_connector_pin1_position?: Point3
  to_connector_pin1_position?: Point3
  cableprinter_string: string
  path: Point3[]
}

expectTypesMatch<CadCable, InferredCadCable>(true)
