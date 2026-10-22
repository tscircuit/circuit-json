import { z } from "zod"
import type { Point3 } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

const finite_point3 = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  z: z.number().finite(),
})

export const cad_named_edge = z
  .object({
    type: z.literal("cad_named_edge"),
    cad_named_edge_id: z.string().trim().min(1),
    cad_component_id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    start: finite_point3,
    end: finite_point3,
  })
  .refine(
    (edge) =>
      edge.start.x !== edge.end.x ||
      edge.start.y !== edge.end.y ||
      edge.start.z !== edge.end.z,
    { message: "A named edge must have distinct endpoints", path: ["end"] },
  )
  .describe(
    "A stable, authored analytic straight edge defined by the owning CAD model. Names are unique within the owner. Endpoints are absolute points in right-handed CAD world XYZ in millimeters (+X right, +Y top, +Z above), after applying model-to-world transforms. The model definition supplies the edge name and endpoints, independently of mesh tessellation. Inferred view extents are dimension presets, not fabricated named edges. It adds no solid geometry.",
  )

/** Model-defined analytic edge in CAD world mm, with +Z up. Producers transform
 * model-local endpoints as points, including scale, rotation and translation,
 * exactly once. Renderers must not reapply the owning model's transform.
 * Names are stable within cad_component_id, independent of mesh tessellation.
 * Endpoints must be finite and distinct. The producer defines actual model edges.
 * Inferred extents belong to dimension presets, not synthetic named edge records.
 */
export interface CadNamedEdge {
  type: "cad_named_edge"
  cad_named_edge_id: string
  cad_component_id: string
  name: string
  start: Point3
  end: Point3
}

export type CadNamedEdgeInput = z.input<typeof cad_named_edge>
expectTypesMatch<CadNamedEdge, z.infer<typeof cad_named_edge>>(true)
