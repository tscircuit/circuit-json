import { z } from "zod"
import { point } from "../common/point"
import { size } from "../common/size"

export const schematic_debug_object = z.object({
  type: z.literal("schematic_debug_object"),
  shape: z.enum(["rect"]).default("rect"),
  center: point,
  size: size,
})

export type SchematicDebugObject = z.infer<typeof schematic_debug_object>
export type SchematicDebugObjectInput = z.input<typeof schematic_debug_object>
