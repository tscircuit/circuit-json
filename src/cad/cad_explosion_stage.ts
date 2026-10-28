import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

export const cad_explosion_stage = z
  .object({
    type: z.literal("cad_explosion_stage"),
    cad_explosion_stage_id: z.string().min(1),
    name: z
      .string()
      .min(1)
      .describe("Qualified authored stage name, for display."),
    order: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "Unique zero-based playback order after resolving authored stage dependencies. Array order is irrelevant.",
      ),
    cad_reference_surface_ids: z
      .array(z.string().min(1))
      .optional()
      .describe(
        "Reference geometry belonging to this stage, including model-less assembly owners.",
      ),
    cad_component_ids: z
      .array(z.string().min(1))
      .describe(
        "Explicit membership of this stage's moving assembly. May include an entire subassembly. A move targeting this stage translates every member once, preserving prior relative displacements; it does not execute the stage's moves.",
      ),
  })
  .describe(
    "One ordered step of an assembly explosion, with explicit movable membership. Geometry remains in its assembled pose; movement records describe a separate display view.",
  )

export interface CadExplosionStage {
  type: "cad_explosion_stage"
  cad_explosion_stage_id: string
  name: string
  order: number
  cad_component_ids: string[]
  cad_reference_surface_ids?: string[]
}
export type CadExplosionStageInput = z.input<typeof cad_explosion_stage>
expectTypesMatch<CadExplosionStage, z.infer<typeof cad_explosion_stage>>(true)
