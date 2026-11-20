import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "../base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_assembly_collision_error = base_circuit_json_error
  .extend({
    type: z.literal("cad_assembly_collision_error"),
    cad_assembly_collision_error_id: getZodPrefixedIdWithDefault(
      "cad_assembly_collision_error",
    ),
    error_type: z
      .literal("cad_assembly_collision_error")
      .default("cad_assembly_collision_error"),
    cad_component_id: z.string().min(1),
    pcb_board_id: z.string().min(1),
    source_component_ids: z.array(z.string().min(1)).min(1),
    intersection_volume_mm3: z.number().finite().positive(),
  })
  .describe(
    "A mechanical CAD component and PCB substrate intersect in the assembled pose. The intersection volume is measured in cubic millimetres. Surface contact has no positive volume.",
  )

export interface CadAssemblyCollisionError extends BaseCircuitJsonError {
  type: "cad_assembly_collision_error"
  cad_assembly_collision_error_id: string
  error_type: "cad_assembly_collision_error"
  cad_component_id: string
  pcb_board_id: string
  source_component_ids: string[]
  /** Shared solid volume in the assembled pose, in mm³. */
  intersection_volume_mm3: number
}

export type CadAssemblyCollisionErrorInput = z.input<
  typeof cad_assembly_collision_error
>

expectTypesMatch<
  CadAssemblyCollisionError,
  z.infer<typeof cad_assembly_collision_error>
>(true)
