import { z } from "zod"
import { getZodPrefixedIdWithDefault, point, type Point } from "src/common"
import { layer_ref, visible_layer } from "src/pcb/properties/layer_ref"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const finite_distance = distance.pipe(z.number().finite())
const positive_distance = distance.pipe(z.number().finite().positive())

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

const circle = opening_base.extend({
  shape: z.literal("circle"),
  x: finite_distance,
  y: finite_distance,
  radius: positive_distance,
  width: z.never().optional(),
  height: z.never().optional(),
  ccw_rotation: z.never().optional(),
  points: z.never().optional(),
})

const rect = opening_base.extend({
  shape: z.literal("rect"),
  x: finite_distance,
  y: finite_distance,
  width: positive_distance,
  height: positive_distance,
  radius: z.never().optional(),
  ccw_rotation: z.never().optional(),
  points: z.never().optional(),
})

const rotated_rect = rect.extend({
  shape: z.literal("rotated_rect"),
  ccw_rotation: rotation.pipe(z.number().finite()),
})

const polygon = opening_base.extend({
  shape: z.literal("polygon"),
  points: z
    .array(point.extend({ x: finite_distance, y: finite_distance }))
    .min(3)
    .refine((points) => {
      const twice_area = points.reduce((sum, point, index) => {
        const next = points[(index + 1) % points.length]!
        return sum + point.x * next.y - next.x * point.y
      }, 0)
      return Number.isFinite(twice_area) && twice_area !== 0
    }, "Solder-mask opening must enclose a nonzero area"),
  x: z.never().optional(),
  y: z.never().optional(),
  width: z.never().optional(),
  height: z.never().optional(),
  radius: z.never().optional(),
  ccw_rotation: z.never().optional(),
})

export const pcb_soldermask_opening = z
  .discriminatedUnion("shape", [circle, rect, rotated_rect, polygon])
  .describe(
    "An explicit opening in top or bottom solder mask or flex coverlay, independent of pads. Removes mask without adding copper or solder paste.",
  )

export type PcbSoldermaskOpeningInput = z.input<typeof pcb_soldermask_opening>

/** A circular solder-mask opening centered at (x, y). */
export interface PcbSoldermaskOpeningCircle {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  shape: "circle"
  layer: "top" | "bottom"
  x: Distance
  y: Distance
  radius: Distance
  width?: never
  height?: never
  ccw_rotation?: never
  points?: never
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/** A rectangular solder-mask opening centered at (x, y). */
export interface PcbSoldermaskOpeningRect {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  shape: "rect"
  layer: "top" | "bottom"
  x: Distance
  y: Distance
  width: Distance
  height: Distance
  radius?: never
  ccw_rotation?: never
  points?: never
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/** A rectangular opening rotated counterclockwise about (x, y), in degrees. */
export interface PcbSoldermaskOpeningRotatedRect {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  shape: "rotated_rect"
  layer: "top" | "bottom"
  x: Distance
  y: Distance
  width: Distance
  height: Distance
  ccw_rotation: Rotation
  radius?: never
  points?: never
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/** An implicitly closed boundary of at least three points enclosing nonzero area. */
export interface PcbSoldermaskOpeningPolygon {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  shape: "polygon"
  layer: "top" | "bottom"
  points: Point[]
  x?: never
  y?: never
  width?: never
  height?: never
  radius?: never
  ccw_rotation?: never
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

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
