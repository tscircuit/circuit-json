import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const pcb_hole_circle = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("circle"),
  hole_diameter: z.number(),
  x: distance,
  y: distance,
})

export const pcb_hole_circle_shape = pcb_hole_circle.describe(
  "Defines a circular hole on the PCB",
)

export type PcbHoleCircleInput = z.input<typeof pcb_hole_circle>
type InferredPcbHoleCircle = z.infer<typeof pcb_hole_circle>

/**
 * Defines a circular hole on the PCB
 */
export interface PcbHoleCircle {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle"
  hole_diameter: number
  x: Distance
  y: Distance
}

expectTypesMatch<PcbHoleCircle, InferredPcbHoleCircle>(true)

const pcb_hole_rect = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("rect"),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
})

export const pcb_hole_rect_shape = pcb_hole_rect.describe(
  "Defines a rectangular (square-capable) hole on the PCB. Use equal width/height for square.",
)

export type PcbHoleRectInput = z.input<typeof pcb_hole_rect>
type InferredPcbHoleRect = z.infer<typeof pcb_hole_rect>

/**
 * Defines a rectangular (or square) hole on the PCB
 */
export interface PcbHoleRect {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "rect"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
}
expectTypesMatch<PcbHoleRect, InferredPcbHoleRect>(true)

const pcb_hole_circle_or_square = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.enum(["circle", "square"]),
  hole_diameter: z.number(),
  x: distance,
  y: distance,
})

export const pcb_hole_circle_or_square_shape =
  pcb_hole_circle_or_square.describe(
    "Defines a circular or square hole on the PCB",
  )

export type PcbHoleCircleOrSquareInput = z.input<
  typeof pcb_hole_circle_or_square
>
type InferredPcbHoleCircleOrSquare = z.infer<typeof pcb_hole_circle_or_square>

/**
 * Defines a circular or square hole on the PCB
 */

/**
 * @deprecated Use `PcbHoleCircle` for circular holes or `PcbHoleRect` for square holes.
 */
export interface PcbHoleCircleOrSquare {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "circle" | "square"
  hole_diameter: number
  x: Distance
  y: Distance
}

expectTypesMatch<PcbHoleCircleOrSquare, InferredPcbHoleCircleOrSquare>(true)

const pcb_hole_oval = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("oval"),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
})

export const pcb_hole_oval_shape = pcb_hole_oval.describe(
  "Defines an oval hole on the PCB",
)

export type PcbHoleOvalInput = z.input<typeof pcb_hole_oval>
type InferredPcbHoleOval = z.infer<typeof pcb_hole_oval>

/**
 * Defines an oval hole on the PCB
 */
export interface PcbHoleOval {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "oval"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
}

expectTypesMatch<PcbHoleOval, InferredPcbHoleOval>(true)

const pcb_hole_pill = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("pill"),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
})

export const pcb_hole_pill_shape = pcb_hole_pill.describe(
  "Defines a pill-shaped hole on the PCB",
)

export type PcbHolePillInput = z.input<typeof pcb_hole_pill>
type InferredPcbHolePill = z.infer<typeof pcb_hole_pill>

/**
 * Defines a pill-shaped hole on the PCB
 */
export interface PcbHolePill {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "pill"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
}

expectTypesMatch<PcbHolePill, InferredPcbHolePill>(true)

const pcb_hole_rotated_pill = z.object({
  type: z.literal("pcb_hole"),
  pcb_hole_id: getZodPrefixedIdWithDefault("pcb_hole"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  hole_shape: z.literal("rotated_pill"),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
  ccw_rotation: rotation,
})

export const pcb_hole_rotated_pill_shape = pcb_hole_rotated_pill.describe(
  "Defines a rotated pill-shaped hole on the PCB",
)

export type PcbHoleRotatedPillInput = z.input<typeof pcb_hole_rotated_pill>
type InferredPcbHoleRotatedPill = z.infer<typeof pcb_hole_rotated_pill>

/**
 * Defines a rotated pill-shaped hole on the PCB
 */
export interface PcbHoleRotatedPill {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "rotated_pill"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
  ccw_rotation: Rotation
}

expectTypesMatch<PcbHoleRotatedPill, InferredPcbHoleRotatedPill>(true)

export const pcb_hole = pcb_hole_circle_or_square
  .or(pcb_hole_oval)
  .or(pcb_hole_pill)
  .or(pcb_hole_rotated_pill)
  .or(pcb_hole_circle)
  .or(pcb_hole_rect)

/**
 * @deprecated Use PcbHoleCircleOrSquare, PcbHoleCircle, PcbHoleSquare PcbHoleOval, PcbHolePill, or PcbHoleRotatedPill
 */
export type PCBHoleInput = z.input<typeof pcb_hole>
/**
 * @deprecated Use PcbHoleCircleOrSquare, PcbHoleCircle, PcbHoleSquare, PcbHoleOval, PcbHolePill, or PcbHoleRotatedPill
 */
export type PCBHole = z.infer<typeof pcb_hole>

export type PcbHole =
  | PcbHoleCircleOrSquare
  | PcbHoleOval
  | PcbHolePill
  | PcbHoleRotatedPill
  | PcbHoleCircle
  | PcbHoleRect
