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
})

const rect = opening_base.extend({
  shape: z.literal("rect"),
  x: finite_distance,
  y: finite_distance,
  width: positive_distance,
  height: positive_distance,
})

const rotated_rect = rect.extend({
  shape: z.literal("rotated_rect"),
  ccw_rotation: rotation.pipe(z.number().finite()),
})

const polygon = opening_base.extend({
  shape: z.literal("polygon"),
  points: z
    .array(point.extend({ x: finite_distance, y: finite_distance }))
    .min(3),
})

export const pcb_soldermask_opening = z
  .discriminatedUnion("shape", [circle, rect, rotated_rect, polygon])
  .describe(
    "An explicit opening in the top or bottom solder mask. Removes mask without adding copper or solder paste.",
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
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/** An opening whose boundary joins at least three points and closes implicitly. */
export interface PcbSoldermaskOpeningPolygon {
  type: "pcb_soldermask_opening"
  pcb_soldermask_opening_id: string
  shape: "polygon"
  layer: "top" | "bottom"
  points: Point[]
  pcb_component_id?: string
  pcb_group_id?: string
  subcircuit_id?: string
}

/**
 * Explicit solder-mask removal, independent of pads, vias, and electrical nets.
 * Numeric coordinates and dimensions use millimeters in the PCB coordinate system.
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
