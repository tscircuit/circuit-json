import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_collision_error = base_circuit_json_error
  .extend({
    type: z.literal("cad_collision_error"),
    cad_collision_error_id: getZodPrefixedIdWithDefault("cad_collision_error"),
    error_type: z.literal("cad_collision_error").default("cad_collision_error"),
    cad_component_ids: z.array(z.string()).min(1),
    pcb_component_ids: z.array(z.string()).optional(),
    source_component_ids: z.array(z.string()).min(1),
    intersection_area_mm2: z.number().finite().nonnegative(),
    threshold_area_mm2: z.number().finite().nonnegative(),
  })
  .describe(
    "An aperture-bearing part intersects the finished enclosure. The intersection_area_mm2 is the union silhouette area of the solid intersection projected along the aperture face normal, in the right-handed Circuit JSON world frame (+X right, +Y top, +Z above). It is an area in square millimetres, not intersection volume or surface area. This indicates possible aperture misplacement, insufficient size/depth, or body clearance problems; it does not prove which cause applies.",
  )

export type CadCollisionErrorInput = z.input<typeof cad_collision_error>
export interface CadCollisionError extends BaseCircuitJsonError {
  type: "cad_collision_error"
  cad_collision_error_id: string
  error_type: "cad_collision_error"
  cad_component_ids: string[]
  pcb_component_ids?: string[]
  source_component_ids: string[]
  /** Union silhouette of solid intersection, projected along face normal (mm²). */
  intersection_area_mm2: number
  threshold_area_mm2: number
}

expectTypesMatch<CadCollisionError, z.infer<typeof cad_collision_error>>(true)
