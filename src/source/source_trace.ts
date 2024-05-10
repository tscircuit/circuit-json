import { z } from "zod"

export const source_trace = z.object({
  type: z.literal("source_trace"),
  source_trace_id: z.string(),
  connected_source_port_ids: z.array(z.string()),
  connected_source_net_ids: z.array(z.string()),
})

export type SourceTrace = z.infer<typeof source_trace>
