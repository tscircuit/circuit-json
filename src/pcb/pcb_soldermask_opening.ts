import { z } from "zod"
import {
  getZodPrefixedIdWithDefault,
  circle_shape,
  rect_shape,
  rotated_rect_shape,
  polygon_shape,
  type CircleShape,
  type RectShape,
  type RotatedRectShape,
  type PolygonShape,
} from "src/common"
import { layer_ref, visible_layer } from "src/pcb/properties/layer_ref"
import { expectTypesMatch } from "src/utils/expect-types-match"

const opening_base = z.object({
  type: z.literal("pcb_soldermask_opening"),
  pcb_soldermask_opening_id: getZodPrefixedIdWithDefault(
    "pcb_soldermask_opening",
  ),
  layer: layer_ref.pipe(visible_layer),
  pcb_component_id: z.string().optional(),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
})

export const pcb_soldermask_opening = z
  .discriminatedUnion("shape", [
    circle_shape.extend(opening_base.shape),
    rect_shape.extend(opening_base.shape),
    rotated_rect_shape.extend(opening_base.shape),
    polygon_shape.extend(opening_base.shape),
  ])
  .describe(
    "An explicit opening in top or bottom solder mask or flex coverlay, independent of pads. Removes mask without adding copper or solder paste.",
  )

export type PcbSoldermaskOpeningInput = z.input<typeof pcb_soldermask_opening>

export interface PcbSoldermaskOpeningBase {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  layer: "top" | "bottom"
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/** A circular solder-mask opening centered at (x, y). */
export interface PcbSoldermaskOpeningCircle
  extends PcbSoldermaskOpeningBase,
    CircleShape {}

/** A rectangular solder-mask opening centered at (x, y). */
export interface PcbSoldermaskOpeningRect
  extends PcbSoldermaskOpeningBase,
    RectShape {}

/** A rectangular opening rotated counterclockwise about (x, y), in degrees. */
export interface PcbSoldermaskOpeningRotatedRect
  extends PcbSoldermaskOpeningBase,
    RotatedRectShape {}

/** An implicitly closed boundary of at least three points enclosing nonzero area. */
export interface PcbSoldermaskOpeningPolygon
  extends PcbSoldermaskOpeningBase,
    PolygonShape {}

/**
 * Solder-mask or flex-coverlay removal, independent of pads, vias, and electrical nets.
 * Numeric coordinates and dimensions use millimeters in the PCB coordinate system.
 * Placement, parent rotation, and bottom-footprint reflection are already resolved.
 * Openings expose the underlying substrate or existing copper; they add no material.
 */
export type PcbSoldermaskOpening =
  | PcbSoldermaskOpeningCircle
  | PcbSoldermaskOpeningRect
  | PcbSoldermaskOpeningRotatedRect
  | PcbSoldermaskOpeningPolygon

expectTypesMatch<PcbSoldermaskOpening, z.output<typeof pcb_soldermask_opening>>(
  true,
)
