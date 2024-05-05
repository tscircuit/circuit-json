import { z } from "zod"
import { distance } from "../units"

export const schematic_trace = z.object({
  type: z.literal("schematic_trace"),
  schematic_trace_id: z.string(),
  source_trace_id: z.string(),
  edges: z.array(
    z.object({
      from: z.object({
        x: z.number(),
        y: z.number(),
      }),
      to: z.object({
        x: z.number(),
        y: z.number(),
      }),
      from_schematic_port_id: z.string().optional(),
      to_schematic_port_id: z.string().optional(),
    })
  ),
})

export type SchematicTraceInput = z.input<typeof schematic_trace>
export type SchematicTrace = z.infer<typeof schematic_trace>
