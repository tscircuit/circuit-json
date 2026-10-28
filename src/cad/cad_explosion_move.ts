import { z } from "zod"
import { point3, type Point3 } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_explosion_move = z
  .object({
    type: z.literal("cad_explosion_move"),
    cad_explosion_move_id: z.string().min(1),
    cad_explosion_stage_id: z
      .string()
      .min(1)
      .describe("Stage executing this move."),
    order: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "Unique zero-based sequential move order within the executing stage.",
      ),
    targets: z
      .array(
        z.discriminatedUnion("type", [
          z.object({
            type: z.literal("cad_reference_surface"),
            cad_reference_surface_id: z.string().min(1),
          }),
          z.object({
            type: z.literal("cad_component"),
            cad_component_id: z.string().min(1),
          }),
          z.object({
            type: z.literal("cad_explosion_stage"),
            cad_explosion_stage_id: z.string().min(1),
          }),
        ]),
      )
      .min(1)
      .describe(
        "Components or entire stages to translate simultaneously. Stage targets expand their explicit cad_component_ids. Deduplicate the union per move; separate moves accumulate.",
      ),
    translation: point3
      .refine(
        (p) => [p.x, p.y, p.z].every(Number.isFinite),
        "Explosion translations must be finite",
      )
      .describe(
        "Resolved displacement in right-handed circuit-world XYZ, millimeters (+Z above). A vector, not an absolute destination. Producers rotate owner-local offsets into world space once. Partial progress scales this vector.",
      ),
  })
  .describe(
    "An ordered straight translation. Stage membership, target IDs and order must be validated against the whole document. Stage progress divides equally among sequential moves. No rotation, PCB movement or collision-clearance claim is implied.",
  )

export type CadExplosionTarget =
  | { type: "cad_reference_surface"; cad_reference_surface_id: string }
  | { type: "cad_component"; cad_component_id: string }
  | { type: "cad_explosion_stage"; cad_explosion_stage_id: string }
export interface CadExplosionMove {
  type: "cad_explosion_move"
  cad_explosion_move_id: string
  cad_explosion_stage_id: string
  order: number
  targets: CadExplosionTarget[]
  translation: Point3
}
export type CadExplosionMoveInput = z.input<typeof cad_explosion_move>
expectTypesMatch<CadExplosionMove, z.infer<typeof cad_explosion_move>>(true)
