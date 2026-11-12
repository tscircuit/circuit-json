import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import {
  drawing_part_view_base,
  type DrawingPartView,
} from "./drawing_part_view"

export const drawing_explosion_view = drawing_part_view_base
  .omit({ drawing_part_view_id: true })
  .extend({
    type: z.literal("drawing_explosion_view"),
    drawing_explosion_view_id: z.string().trim().min(1),
    drawing_assembly_stage_id: z.string().trim().min(1),
    drawing_explosion_id: z.string().trim().min(1),
    source_group_id: z.never().optional(),
    source_component_ids: z.never().optional(),
  })
  .describe(
    "An orthographic exploded drawing viewport. Requires a drawing stage for membership and a reusable drawing explosion for the pose. Shares paper layout, direction, scale, hidden-edge and section controls with drawing_part_view. CAD coordinates use mm with +Z up; paper coordinates use mm with +X right/+Y up.",
  )
export interface DrawingExplosionView
  extends Omit<
    DrawingPartView,
    | "type"
    | "drawing_part_view_id"
    | "drawing_assembly_stage_id"
    | "drawing_explosion_id"
    | "source_group_id"
    | "source_component_ids"
  > {
  type: "drawing_explosion_view"
  drawing_explosion_view_id: string
  drawing_assembly_stage_id: string
  drawing_explosion_id: string
  source_group_id?: never
  source_component_ids?: never
}
export type DrawingExplosionViewInput = z.input<typeof drawing_explosion_view>
expectTypesMatch<DrawingExplosionView, z.infer<typeof drawing_explosion_view>>(
  true,
)
