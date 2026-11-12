import { z } from "zod"
import { expectTypesMatch } from "../utils/expect-types-match"
import {
  drawing_part_selection,
  has_drawing_part_selection,
  type DrawingPartSelection,
} from "./drawing_assembly_stage"

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
export const drawing_explosion = z
  .object({
    type: z.literal("drawing_explosion"),
    drawing_explosion_id: z.string().trim().min(1),
    name: z.string().optional(),
    display_name: z.string().optional(),
    factor: z.number().finite().min(0).max(1).optional(),
    show_trails: z.boolean().optional(),
    moves: z.array(drawing_explosion_move).min(1),
  })
  .describe(
    "A drawing-only exploded pose. Moves are simultaneous world translations from assembled placement, multiplied by factor (default 1); 0 restores assembly. Targets must not overlap across moves. show_trails defaults false. Does not execute or change ordered cad_explosion_move playback or certify an insertion path.",
  )
export interface DrawingExplosion {
  type: "drawing_explosion"
  drawing_explosion_id: string
  name?: string
  display_name?: string
  factor?: number
  show_trails?: boolean
  moves: DrawingExplosionMove[]
}
export type DrawingExplosionInput = z.input<typeof drawing_explosion>
expectTypesMatch<DrawingExplosionMove, z.infer<typeof drawing_explosion_move>>(
  true,
)
expectTypesMatch<DrawingExplosion, z.infer<typeof drawing_explosion>>(true)
