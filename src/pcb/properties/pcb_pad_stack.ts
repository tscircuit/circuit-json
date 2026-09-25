import { z } from "zod"
import { point } from "src/common"
import { distance, rotation } from "src/units"
import { layer_ref } from "./layer_ref"

const pcb_pad_stack_circle = z.object({
  layer: layer_ref,
  shape: z.literal("circle"),
  radius: distance,
})

const pcb_pad_stack_rect = z.object({
  layer: layer_ref,
  shape: z.literal("rect"),
  width: distance,
  height: distance,
  ccw_rotation: rotation.optional(),
  corner_radius: distance.optional(),
})

const pcb_pad_stack_pill = z.object({
  layer: layer_ref,
  shape: z.literal("pill"),
  width: distance,
  height: distance,
  radius: distance,
  ccw_rotation: rotation.optional(),
})

const pcb_pad_stack_polygon = z.object({
  layer: layer_ref,
  shape: z.literal("polygon"),
  /** Points are relative to the plated hole or via center. */
  points: z.array(point).min(3),
  ccw_rotation: rotation.optional(),
})

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

export type PcbPadStackEntry = z.infer<typeof pcb_pad_stack_entry>
export type PcbPadStack = z.infer<typeof pcb_pad_stack>
