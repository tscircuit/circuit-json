import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"
import {
  capacitor_connection,
  trace_max_length_origin,
  type CapacitorConnection,
  type TraceMaxLengthOrigin,
} from "./properties/trace_length_constraint"

export interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  max_length?: number
  max_length_origin?: TraceMaxLengthOrigin
  capacitor_connection?: CapacitorConnection
  max_via_count?: number
  name?: string
  display_name?: string
  min_trace_thickness?: number
}

export const source_trace = z.object({
  type: z.literal("source_trace"),
  source_trace_id: z.string(),
  connected_source_port_ids: z.array(z.string()),
  connected_source_net_ids: z.array(z.string()),
  subcircuit_id: z.string().optional(),
  subcircuit_connectivity_map_key: z.string().optional(),
  max_length: z.number().optional(),
  max_length_origin: trace_max_length_origin.optional(),
  capacitor_connection: capacitor_connection.optional(),
  max_via_count: z.number().int().nonnegative().optional(),
  name: z.string().optional(),
  min_trace_thickness: z.number().optional(),
  display_name: z.string().optional(),
})

type InferredSourceTrace = z.infer<typeof source_trace>

expectTypesMatch<SourceTrace, InferredSourceTrace>(true)
