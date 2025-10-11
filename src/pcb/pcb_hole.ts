import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
  hole_shape: z.enum(["oval", "pill"]),
  hole_width: z.number(),
  hole_height: z.number(),
  x: distance,
  y: distance,
  ccw_rotation: rotation.default(0),
})

export const pcb_hole_oval_shape = pcb_hole_oval.describe(
  "Defines an oval or pill-shaped hole on the PCB",
)

export type PcbHoleOvalInput = z.input<typeof pcb_hole_oval>
type InferredPcbHoleOval = z.infer<typeof pcb_hole_oval>

/**
 * Defines an oval or pill-shaped hole on the PCB
 */
export interface PcbHoleOval {
  type: "pcb_hole"
  pcb_hole_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  hole_shape: "oval" | "pill"
  hole_width: number
  hole_height: number
  x: Distance
  y: Distance
  ccw_rotation: Rotation
}

expectTypesMatch<PcbHoleOval, InferredPcbHoleOval>(true)

export const pcb_hole = pcb_hole_circle_or_square.or(pcb_hole_oval)

/**
 * @deprecated Use PcbHoleCircleOrSquare or PcbHoleOval
 */
export type PCBHoleInput = z.input<typeof pcb_hole>
/**
 * @deprecated Use PcbHoleCircleOrSquare or PcbHoleOval
 */
export type PCBHole = z.infer<typeof pcb_hole>

export type PcbHole = PcbHoleCircleOrSquare | PcbHoleOval
