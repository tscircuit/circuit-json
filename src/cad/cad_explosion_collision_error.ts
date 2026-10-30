import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_explosion_collision_obstacle = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("cad_component"),
    cad_component_id: z.string().min(1),
  }),
  z.object({ type: z.literal("pcb_board"), pcb_board_id: z.string().min(1) }),
])

export type CadExplosionCollisionObstacle =
  | { type: "cad_component"; cad_component_id: string }
  | { type: "pcb_board"; pcb_board_id: string }

export const cad_explosion_collision_error = base_circuit_json_error
  .extend({
    type: z.literal("cad_explosion_collision_error"),
    cad_explosion_collision_error_id: getZodPrefixedIdWithDefault(
      "cad_explosion_collision_error",
    ),
    error_type: z
      .literal("cad_explosion_collision_error")
      .default("cad_explosion_collision_error"),
    cad_explosion_stage_id: z.string().min(1),
    cad_explosion_move_id: z.string().min(1),
    moving_cad_component_id: z.string().min(1),
    obstacle: cad_explosion_collision_obstacle,
    source_component_ids: z.array(z.string().min(1)).min(1),
    swept_intersection_volume_mm3: z
      .number()
      .finite()
      .positive()
      .describe(
        "Volume of the obstacle intersected by the moving solid's continuous translation sweep, excluding space occupied by that solid at the start of this move. Cubic millimetres; not instantaneous penetration volume or contact area.",
      ),
  })
  .describe(
    "A straight explosion move enters an obstacle. Earlier stages and moves have already been applied; targets of the same move translate together and do not collide with each other. Existing overlap at the start of the move and zero-volume touching are excluded. Geometry uses right-handed Circuit JSON world coordinates (+X right, +Y top, +Z above), in millimetres. This error identifies a collision, not an exact time of first contact. Its absence does not establish clearance when geometry could not be checked.",
  )

export interface CadExplosionCollisionError extends BaseCircuitJsonError {
  type: "cad_explosion_collision_error"
  cad_explosion_collision_error_id: string
  error_type: "cad_explosion_collision_error"
  cad_explosion_stage_id: string
  cad_explosion_move_id: string
  moving_cad_component_id: string
  obstacle: CadExplosionCollisionObstacle
  source_component_ids: string[]
  /** Newly swept obstacle volume in mm³, excluding the move's initial solid. */
  swept_intersection_volume_mm3: number
}
export type CadExplosionCollisionErrorInput = z.input<
  typeof cad_explosion_collision_error
>
expectTypesMatch<
  CadExplosionCollisionError,
  z.infer<typeof cad_explosion_collision_error>
>(true)
