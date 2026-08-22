import { z } from "zod"
import {
  getZodPrefixedIdWithDefault,
  point,
  type Point,
  size,
  type Size,
} from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_debug_object_base = z.object({
  type: z.literal("pcb_debug_object"),
  pcb_debug_object_id: getZodPrefixedIdWithDefault("pcb_debug_object"),
  label: z.string().optional(),
  subcircuit_id: z.string().optional(),
})

export const pcb_debug_rect = pcb_debug_object_base.extend({
  shape: z.literal("rect"),
  center: point,
  size: size,
})

export const pcb_debug_line = pcb_debug_object_base.extend({
  shape: z.literal("line"),
  start: point,
  end: point,
})

export const pcb_debug_point = pcb_debug_object_base.extend({
  shape: z.literal("point"),
  center: point,
})

export const pcb_debug_object = z.discriminatedUnion("shape", [
  pcb_debug_rect,
  pcb_debug_line,
  pcb_debug_point,
])
type InferredPcbDebugObject = z.infer<typeof pcb_debug_object>

export interface PcbDebugRect {
  type: "pcb_debug_object"
  pcb_debug_object_id: string
  label?: string
  shape: "rect"
  center: Point
  size: Size
  subcircuit_id?: string
}

export interface PcbDebugLine {
  type: "pcb_debug_object"
  pcb_debug_object_id: string
  label?: string
  shape: "line"
  start: Point
  end: Point
  subcircuit_id?: string
}

export interface PcbDebugPoint {
  type: "pcb_debug_object"
  pcb_debug_object_id: string
  label?: string
  shape: "point"
  center: Point
  subcircuit_id?: string
}

export type PcbDebugObject = PcbDebugRect | PcbDebugLine | PcbDebugPoint

expectTypesMatch<PcbDebugObject, InferredPcbDebugObject>(true)
export type PcbDebugObjectInput = z.input<typeof pcb_debug_object>
