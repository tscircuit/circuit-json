import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_connectivity_map_key?: string
}

export const source_trace = z.object({
  type: z.literal("source_trace"),
  source_trace_id: z.string(),
  connected_source_port_ids: z.array(z.string()),
  connected_source_net_ids: z.array(z.string()),
  subcircuit_connectivity_map_key: z.string().optional(),
})

type InferredSourceTrace = z.infer<typeof source_trace>

expectTypesMatch<SourceTrace, InferredSourceTrace>(true)
