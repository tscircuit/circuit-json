import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const drawing = z
  .object({
    type: z.literal("drawing"),
    drawing_id: z.string().min(1),
    name: z.string().optional(),
    display_name: z.string().optional(),
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
    source_group_id: z.string().optional(),
    source_component_ids: z.array(z.string().min(1)).optional(),
    model_glb_url: z.string().min(1).optional(),
  })
  .describe(
    "A paper-space engineering drawing sheet. Dimensions are mm. Optional model_glb_url supplies a pre-exported glTF +Y-up scene in mm; otherwise consumers resolve selected circuit geometry.",
  )

export interface Drawing {
  type: "drawing"
  drawing_id: string
  name?: string
  display_name?: string
  width: number
  height: number
  /** Scope to this source group and its descendants. */
  source_group_id?: string
  /** Resolved component selection within the group, or the whole circuit if no group is set. */
  source_component_ids?: string[]
  /** Optional pre-exported scene for precisely this drawing's selected geometry. */
  model_glb_url?: string
}
export type DrawingInput = z.input<typeof drawing>
expectTypesMatch<Drawing, z.infer<typeof drawing>>(true)
