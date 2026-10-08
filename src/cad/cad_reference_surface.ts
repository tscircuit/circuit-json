import { z } from "zod"
import { point3, type Point3 } from "../common"
import { distance } from "../units"
import { expectTypesMatch } from "../utils/expect-types-match"

// Rigid transforms can introduce small floating-point errors in unit directions.
const FRAME_TOLERANCE = 1e-6
const unitDirection = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    z: z.number().finite(),
  })
  .refine(
    (v) => Math.abs(Math.hypot(v.x, v.y, v.z) - 1) <= FRAME_TOLERANCE,
    "Reference surface directions must be unit vectors",
  )
const extent = distance.pipe(z.number().finite().positive())

export const cad_reference_surface = z
  .object({
    type: z.literal("cad_reference_surface"),
    cad_reference_surface_id: z.string().min(1),
    source_component_id: z
      .string()
      .min(1)
      .describe(
        "Owning assembly part's source component ID. The part may have no CAD geometry.",
      ),
    name: z
      .string()
      .trim()
      .min(1)
      .describe(
        "Reference name, unique within the owning part, e.g. shade in STEM.shade.",
      ),
    shape: z.literal("rect"),
    center: point3
      .refine(
        (p) => [p.x, p.y, p.z].every(Number.isFinite),
        "Reference surface centers must be finite",
      )
      .describe(
        "Resolved surface center in right-handed circuit-world XYZ, millimeters: +X right, +Y top, +Z above. An absolute point after assembly placement.",
      ),
    normal: unitDirection.describe(
      "Outward unit normal in circuit-world XYZ. Dimensionless direction; transform with the part's rotation, without translation.",
    ),
    x_axis: unitDirection.describe(
      "In-plane unit X direction in circuit-world XYZ, perpendicular to normal. The second tangent is normal cross x_axis, giving a right-handed frame.",
    ),
    width: extent
      .optional()
      .describe(
        "Rectangular extent along x_axis in millimeters. Supply together with height. Omission leaves the surface's display size unspecified.",
      ),
    height: extent
      .optional()
      .describe(
        "Rectangular extent along normal cross x_axis in millimeters. Supply together with width.",
      ),
    subcircuit_id: z.string().optional(),
  })
  .superRefine((surface, ctx) => {
    if ((surface.width === undefined) !== (surface.height === undefined))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["width"],
        message: "Provide width and height together",
      })
    const { normal: n, x_axis: x } = surface
    if (Math.abs(n.x * x.x + n.y * x.y + n.z * x.z) > FRAME_TOLERANCE)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["x_axis"],
        message: "x_axis must be perpendicular to normal",
      })
  })
  .describe(
    "A named assembly mounting surface with a resolved world-space frame. Reference geometry for optional visualization; does not add solid material or electrical connectivity. The producer resolves part placement independently of CAD-model offsets; renderers consume the world frame without reapplying the owning model's transform.",
  )

export type CadReferenceSurfaceInput = z.input<typeof cad_reference_surface>

/** Resolved reference frame in right-handed circuit world: +X right, +Y top,
 * +Z above. Center and extents are mm; normal and x_axis are dimensionless,
 * perpendicular unit directions, within 1e-6 numerical tolerance. The frame's
 * Y direction is normal cross x_axis. Names are unique within source_component_id.
 * Width and height are both present or both omitted; omission adds no default.
 * This record describes mounting reference geometry for optional visualization.
 */
export interface CadReferenceSurface {
  type: "cad_reference_surface"
  cad_reference_surface_id: string
  source_component_id: string
  name: string
  shape: "rect"
  center: Point3
  normal: Point3
  x_axis: Point3
  width?: number
  height?: number
  subcircuit_id?: string
}

expectTypesMatch<CadReferenceSurface, z.infer<typeof cad_reference_surface>>(
  true,
)
