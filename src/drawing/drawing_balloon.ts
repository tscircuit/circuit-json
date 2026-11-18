import { z } from "zod"
import { ninePointAnchor, type NinePointAnchor } from "../common"
import { expectTypesMatch } from "../utils/expect-types-match"

export const drawing_balloon_harness_target = z.enum([
  "from_connector",
  "to_connector",
  "wires",
])
export type DrawingBalloonHarnessTarget = z.infer<
  typeof drawing_balloon_harness_target
>

export const drawing_balloon = z
  .object({
    type: z.literal("drawing_balloon"),
    drawing_balloon_id: z.string().trim().min(1),
    drawing_harness_view_id: z.string().trim().min(1),
    texts: z
      .array(z.string().refine((s) => s.trim().length > 0, "Blank text"))
      .min(1),
    harness_target: drawing_balloon_harness_target,
    anchor_position: z.object({
      x: z.number().finite(),
      y: z.number().finite(),
    }),
    anchor_alignment: ninePointAnchor,
  })
  .describe(
    "A circled callout with a leader to part of a harness view, typically the item number of a parts list row. Each text draws one circle, side by side left to right, sharing one leader to the target. Texts are resolved by the producer; nothing is looked up from a table. anchor_alignment names the point of the row of circles' bounding rectangle that sits at anchor_position, in page-anchor-relative paper mm, +X right/+Y up. The leader's tip is placed on the target by the renderer.",
  )

export interface DrawingBalloon {
  type: "drawing_balloon"
  drawing_balloon_id: string
  drawing_harness_view_id: string
  /** One circle per text, left to right. */
  texts: string[]
  /** What the leader points at within the harness view. */
  harness_target: DrawingBalloonHarnessTarget
  /** Where the anchor_alignment point of the row of circles sits, relative to the page anchor. */
  anchor_position: { x: number; y: number }
  /** Which point of the circles' bounding rectangle anchor_position locates. */
  anchor_alignment: NinePointAnchor
}
export type DrawingBalloonInput = z.input<typeof drawing_balloon>
expectTypesMatch<DrawingBalloon, z.infer<typeof drawing_balloon>>(true)
