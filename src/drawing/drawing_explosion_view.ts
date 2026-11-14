import {
  drawing_part_selection,
  has_drawing_part_selection,
  type DrawingPartSelection,
} from "./drawing_assembly_stage"
import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import {
  drawing_part_view_base,
  type DrawingPartView,
} from "./drawing_part_view"

export interface DrawingExplosionMove extends DrawingPartSelection {
  /** World-space mm (+Z up), relative to assembled placement. Never cumulative. */
  translation: { x: number; y: number; z: number }
}
export const drawing_explosion_move = drawing_part_selection
  .extend({
    translation: z.object({
      x: z.number().finite(),
      y: z.number().finite(),
      z: z.number().finite(),
    }),
  })
  .refine(
    has_drawing_part_selection,
    "Explosion move requires explicit membership",
  )

expectTypesMatch<DrawingExplosionMove, z.infer<typeof drawing_explosion_move>>(
  true,
)

export const drawing_explosion_view = drawing_part_view_base
  .omit({ drawing_part_view_id: true })
  .extend({
    type: z.literal("drawing_explosion_view"),
    drawing_explosion_view_id: z.string().trim().min(1),
    drawing_assembly_stage_id: z.string().trim().min(1),
    moves: z.array(drawing_explosion_move).min(1),
    factor: z.number().finite().min(0).max(1).optional(),
    show_trails: z.boolean().optional(),
    source_group_id: z.never().optional(),
    source_component_ids: z.never().optional(),
  })
  .describe(
    "An orthographic exploded drawing viewport. Requires a drawing stage for membership and inline moves for the pose. Moves are simultaneous CAD-world translations from assembled placement, multiplied by factor (default 1); factor 0 restores assembly. Move targets must not overlap. show_trails defaults false. Shares paper layout, direction, scale, hidden-edge and section controls with drawing_part_view. CAD coordinates use mm with +Z up; paper coordinates use mm with +X right/+Y up.",
  )
export interface DrawingExplosionView
  extends Omit<
    DrawingPartView,
    | "type"
    | "drawing_part_view_id"
    | "drawing_assembly_stage_id"
    | "moves"
    | "factor"
    | "show_trails"
    | "source_group_id"
    | "source_component_ids"
  > {
  type: "drawing_explosion_view"
  drawing_explosion_view_id: string
  drawing_assembly_stage_id: string
  moves: DrawingExplosionMove[]
  /** Fraction of separation in 0..1; omitted means 1. */
  factor?: number
  /** Separation guides; omitted means false. */
  show_trails?: boolean
  source_group_id?: never
  source_component_ids?: never
}
export type DrawingExplosionViewInput = z.input<typeof drawing_explosion_view>
expectTypesMatch<DrawingExplosionView, z.infer<typeof drawing_explosion_view>>(
  true,
)
