import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"

/** Explicit drawing membership. References form a set; repeated members are deduplicated. */
export interface DrawingPartSelection {
  source_component_ids?: string[]
  pcb_board_ids?: string[]
  includes_stage_ids?: string[]
}
const ids = z.array(z.string().trim().min(1)).min(1)
export const drawing_part_selection = z.object({
  source_component_ids: ids.optional(),
  pcb_board_ids: ids.optional(),
  includes_stage_ids: ids.optional(),
})
export const has_drawing_part_selection = (s: DrawingPartSelection) =>
  Boolean(
    s.source_component_ids?.length ||
      s.pcb_board_ids?.length ||
      s.includes_stage_ids?.length,
  )

export const drawing_assembly_stage = drawing_part_selection
  .extend({
    type: z.literal("drawing_assembly_stage"),
    drawing_assembly_stage_id: z.string().trim().min(1),
    name: z.string().trim().min(1),
    display_name: z.string().optional(),
  })
  .refine(
    has_drawing_part_selection,
    "Drawing stage requires explicit membership",
  )
  .describe(
    "A reusable set of parts for drawing views, including PCB substrates and nested drawing stages. Membership is compositional, not sequential playback. Consumers validate references and reject cycles. Existing cad_explosion_stage playback is unaffected.",
  )
export interface DrawingAssemblyStage extends DrawingPartSelection {
  type: "drawing_assembly_stage"
  drawing_assembly_stage_id: string
  name: string
  display_name?: string
}
export type DrawingAssemblyStageInput = z.input<typeof drawing_assembly_stage>
expectTypesMatch<DrawingPartSelection, z.infer<typeof drawing_part_selection>>(
  true,
)
expectTypesMatch<DrawingAssemblyStage, z.infer<typeof drawing_assembly_stage>>(
  true,
)
