import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import { distance } from "../units"

export interface SchematicTraceEdge {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  is_crossing?: boolean
  from_schematic_port_id?: string
  to_schematic_port_id?: string
}

export interface SchematicTrace {
  type: "schematic_trace"
  schematic_trace_id: string
  source_trace_id?: string
  junctions: {
    x: number
    y: number
  }[]
  edges: SchematicTraceEdge[]
  subcircuit_id?: string
  /** Optional for now, but will be required in a future release */
  subcircuit_connectivity_map_key?: string
}

export const schematic_trace = z.object({
  type: z.literal("schematic_trace"),
  schematic_trace_id: z.string(),
  source_trace_id: z.string().optional(),
  junctions: z.array(
    z.object({
      x: z.number(),
      y: z.number(),
    }),
  ),
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
      is_crossing: z.boolean().optional(),
      from_schematic_port_id: z.string().optional(),
      to_schematic_port_id: z.string().optional(),
    }),
  ),
  subcircuit_id: z.string().optional(),
  // TODO: make required in a future release
  subcircuit_connectivity_map_key: z.string().optional(),
})

export type SchematicTraceInput = z.input<typeof schematic_trace>
type InferredSchematicTrace = z.infer<typeof schematic_trace>

expectTypesMatch<SchematicTraceInput, InferredSchematicTrace>(true)
