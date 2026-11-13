import { z } from "zod"
import { point, type Point } from "src/common"
import { distance, type Distance, rotation, type Rotation } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { layer_ref, type LayerRef } from "./layer_ref"

const pcb_pad_stack_circle = z.object({
  layer: layer_ref,
  shape: z.literal("circle"),
  radius: distance,
})

export interface PcbPadStackCircleEntry {
  layer: LayerRef
  shape: "circle"
  radius: Distance
}

const pcb_pad_stack_rect = z.object({
  layer: layer_ref,
  shape: z.literal("rect"),
  width: distance,
  height: distance,
  ccw_rotation: rotation.optional(),
  corner_radius: distance.optional(),
})

export interface PcbPadStackRectEntry {
  layer: LayerRef
  shape: "rect"
  width: Distance
  height: Distance
  ccw_rotation?: Rotation
  corner_radius?: Distance
}

const pcb_pad_stack_pill = z.object({
  layer: layer_ref,
  shape: z.literal("pill"),
  width: distance,
  height: distance,
  radius: distance,
  ccw_rotation: rotation.optional(),
})

export interface PcbPadStackPillEntry {
  layer: LayerRef
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  ccw_rotation?: Rotation
}

const pcb_pad_stack_polygon = z.object({
  layer: layer_ref,
  shape: z.literal("polygon"),
  /** Points are relative to the plated hole or via center. */
  points: z.array(point).min(3),
  ccw_rotation: rotation.optional(),
})

export interface PcbPadStackPolygonEntry {
  layer: LayerRef
  shape: "polygon"
  /** Points are relative to the plated hole or via center. */
  points: Point[]
  ccw_rotation?: Rotation
}

/** Copper pad geometry for one layer of a plated hole or via. */
export const pcb_pad_stack_entry = z.discriminatedUnion("shape", [
  pcb_pad_stack_circle,
  pcb_pad_stack_rect,
  pcb_pad_stack_pill,
  pcb_pad_stack_polygon,
])

/**
 * Layer-specific copper geometry. Entries override the element's top-level pad
 * geometry on their layer; layers without an entry use the top-level geometry.
 */
export const pcb_pad_stack = z.array(pcb_pad_stack_entry).min(1)

export type PcbPadStackEntry =
  | PcbPadStackCircleEntry
  | PcbPadStackRectEntry
  | PcbPadStackPillEntry
  | PcbPadStackPolygonEntry

export type PcbPadStack = PcbPadStackEntry[]
export type PcbPadStackInput = z.input<typeof pcb_pad_stack>

expectTypesMatch<PcbPadStackEntry, z.infer<typeof pcb_pad_stack_entry>>(true)
expectTypesMatch<PcbPadStack, z.infer<typeof pcb_pad_stack>>(true)
