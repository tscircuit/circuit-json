import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { length, type Length, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

// Common properties base for all cutout shapes (internal)
const pcb_cutout_base = z.object({
  type: z.literal("pcb_cutout"),
  pcb_cutout_id: getZodPrefixedIdWithDefault("pcb_cutout"),
  pcb_group_id: z.string().optional(),
  subcircuit_id: z.string().optional(),
  pcb_board_id: z.string().optional(),
  pcb_panel_id: z.string().optional(),
})

// Rectangular Cutout
export const pcb_cutout_rect = pcb_cutout_base.extend({
  shape: z.literal("rect"),
  center: point,
  width: length,
  height: length,
  rotation: rotation.optional(),
})
export type PcbCutoutRectInput = z.input<typeof pcb_cutout_rect>
type InferredPcbCutoutRect = z.infer<typeof pcb_cutout_rect>
/**
 * Defines a rectangular cutout on the PCB.
 */
export interface PcbCutoutRect {
  type: "pcb_cutout"
  pcb_cutout_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_board_id?: string
  pcb_panel_id?: string
  shape: "rect"
  center: Point
  width: Length
  height: Length
  rotation?: Rotation
}
expectTypesMatch<PcbCutoutRect, InferredPcbCutoutRect>(true)

// Circular Cutout
export const pcb_cutout_circle = pcb_cutout_base.extend({
  shape: z.literal("circle"),
  center: point,
  radius: length,
})
export type PcbCutoutCircleInput = z.input<typeof pcb_cutout_circle>
type InferredPcbCutoutCircle = z.infer<typeof pcb_cutout_circle>
/**
 * Defines a circular cutout on the PCB.
 */
export interface PcbCutoutCircle {
  type: "pcb_cutout"
  pcb_cutout_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_board_id?: string
  pcb_panel_id?: string
  shape: "circle"
  center: Point
  radius: Length
}
expectTypesMatch<PcbCutoutCircle, InferredPcbCutoutCircle>(true)

// Polygon Cutout
export const pcb_cutout_polygon = pcb_cutout_base.extend({
  shape: z.literal("polygon"),
  points: z.array(point),
})
export type PcbCutoutPolygonInput = z.input<typeof pcb_cutout_polygon>
type InferredPcbCutoutPolygon = z.infer<typeof pcb_cutout_polygon>
/**
 * Defines a polygonal cutout on the PCB, specified by a list of points.
 * The polygon should be closed (the last point implicitly connects to the first).
 */
export interface PcbCutoutPolygon {
  type: "pcb_cutout"
  pcb_cutout_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_board_id?: string
  pcb_panel_id?: string
  shape: "polygon"
  points: Point[]
}
expectTypesMatch<PcbCutoutPolygon, InferredPcbCutoutPolygon>(true)

// Path Cutout (for slots along a path)
export const pcb_cutout_path = pcb_cutout_base.extend({
  shape: z.literal("path"),
  route: z.array(point),
  slot_width: length,
  slot_length: length.optional(),
  space_between_slots: length.optional(),
  slot_corner_radius: length.optional(),
})
export type PcbCutoutPathInput = z.input<typeof pcb_cutout_path>
type InferredPcbCutoutPath = z.infer<typeof pcb_cutout_path>
/**
 * Defines a path-based cutout on the PCB, creating slots along the specified path.
 * When slot_length and space_between_slots are specified, creates a dashed pattern of slots.
 * When they are omitted, creates a continuous slot along the entire path.
 * The slot_corner_radius controls the rounding of slot corners (0 = square, slot_width/2 = circle).
 */
export interface PcbCutoutPath {
  type: "pcb_cutout"
  pcb_cutout_id: string
  pcb_group_id?: string
  subcircuit_id?: string
  pcb_board_id?: string
  pcb_panel_id?: string
  shape: "path"
  route: Point[]
  slot_width: Length
  slot_length?: Length
  space_between_slots?: Length
  slot_corner_radius?: Length
}
expectTypesMatch<PcbCutoutPath, InferredPcbCutoutPath>(true)

// Union of all cutout shapes
export const pcb_cutout = z
  .discriminatedUnion("shape", [
    pcb_cutout_rect,
    pcb_cutout_circle,
    pcb_cutout_polygon,
    pcb_cutout_path,
  ])
  .describe("Defines a cutout on the PCB, removing board material.")

export type PcbCutoutInput = z.input<typeof pcb_cutout>
export type PcbCutout =
  | PcbCutoutRect
  | PcbCutoutCircle
  | PcbCutoutPolygon
  | PcbCutoutPath

type InferredPcbCutout = z.infer<typeof pcb_cutout>
expectTypesMatch<PcbCutout, InferredPcbCutout>(true)
