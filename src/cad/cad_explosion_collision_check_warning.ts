import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_explosion_collision_check_warning = base_circuit_json_error
  .extend({
    type: z.literal("cad_explosion_collision_check_warning"),
    cad_explosion_collision_check_warning_id: getZodPrefixedIdWithDefault(
      "cad_explosion_collision_check_warning",
    ),
    error_type: z
      .literal("cad_explosion_collision_check_warning")
      .default("cad_explosion_collision_check_warning"),
    cad_explosion_stage_ids: z.array(z.string().min(1)).min(1),
    cad_component_ids: z.array(z.string().min(1)),
    pcb_board_ids: z.array(z.string().min(1)),
    reason: z.enum([
      "unsupported_geometry",
      "invalid_geometry",
      "collision_check_failed",
    ]),
  })
  .describe(
    "Explosion collision checking is incomplete for the referenced stages. Listed CAD components or PCBs were not checked; empty geometry lists with collision_check_failed indicate that the check itself could not run. This warning must not be interpreted as proof that the motion is clear.",
  )

export interface CadExplosionCollisionCheckWarning
  extends BaseCircuitJsonError {
  type: "cad_explosion_collision_check_warning"
  cad_explosion_collision_check_warning_id: string
  error_type: "cad_explosion_collision_check_warning"
  cad_explosion_stage_ids: string[]
  cad_component_ids: string[]
  pcb_board_ids: string[]
  reason: "unsupported_geometry" | "invalid_geometry" | "collision_check_failed"
}
export type CadExplosionCollisionCheckWarningInput = z.input<
  typeof cad_explosion_collision_check_warning
>
expectTypesMatch<
  CadExplosionCollisionCheckWarning,
  z.infer<typeof cad_explosion_collision_check_warning>
>(true)
