import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_assembly_collision_check_warning = base_circuit_json_error
  .extend({
    type: z.literal("cad_assembly_collision_check_warning"),
    cad_assembly_collision_check_warning_id: getZodPrefixedIdWithDefault(
      "cad_assembly_collision_check_warning",
    ),
    error_type: z
      .literal("cad_assembly_collision_check_warning")
      .default("cad_assembly_collision_check_warning"),
    cad_component_ids: z.array(z.string().min(1)),
    pcb_board_ids: z.array(z.string().min(1)),
    reason: z.enum(["invalid_geometry", "collision_check_failed"]),
  })
  .describe(
    "Assembly collision checking could not verify all geometry in the assembled pose. Empty geometry lists with collision_check_failed indicate that the check itself could not run.",
  )

export interface CadAssemblyCollisionCheckWarning extends BaseCircuitJsonError {
  type: "cad_assembly_collision_check_warning"
  cad_assembly_collision_check_warning_id: string
  error_type: "cad_assembly_collision_check_warning"
  cad_component_ids: string[]
  pcb_board_ids: string[]
  reason: "invalid_geometry" | "collision_check_failed"
}

export type CadAssemblyCollisionCheckWarningInput = z.input<
  typeof cad_assembly_collision_check_warning
>

expectTypesMatch<
  CadAssemblyCollisionCheckWarning,
  z.infer<typeof cad_assembly_collision_check_warning>
>(true)
