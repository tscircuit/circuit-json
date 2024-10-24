import { z } from "zod"
import { point, type Point } from "../common/point"
import { size, type Size } from "../common/size"
import { expectTypesMatch } from "src/utils/expect-types-match"

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
type InferredSchematicDebugObject = z.infer<typeof schematic_debug_object>

export interface SchematicDebugRect {
  type: "schematic_debug_object"
  label?: string
  shape: "rect"
  center: Point
  size: Size
}

export interface SchematicDebugLine {
  type: "schematic_debug_object"
  label?: string
  shape: "line"
  start: Point
  end: Point
}

export type SchematicDebugObject = SchematicDebugRect | SchematicDebugLine

expectTypesMatch<SchematicDebugObject, InferredSchematicDebugObject>(true)
export type SchematicDebugObjectInput = z.input<typeof schematic_debug_object>
