import { z } from "zod"
import { point } from "../common/point"
import { size } from "../common/size"

export const schematic_debug_object_base = z.object({
  type: z.literal("schematic_debug_object"),
  label: z.string().optional(),
})

export const schematic_debug_rect = schematic_debug_object_base.extend({
  shape: z.literal("rect"),
  center: point,
  size: size,
})

export const schematic_debug_line = schematic_debug_object_base.extend({
  shape: z.literal("line"),
  start: point,
  end: point,
})

export const schematic_debug_object = z.discriminatedUnion("shape", [
  schematic_debug_rect,
  schematic_debug_line,
])

export type SchematicDebugObject = z.infer<typeof schematic_debug_object>
export type SchematicDebugRect = z.infer<typeof schematic_debug_rect>
export type SchematicDebugLine = z.infer<typeof schematic_debug_line>
export type SchematicDebugObjectInput = z.input<typeof schematic_debug_object>
