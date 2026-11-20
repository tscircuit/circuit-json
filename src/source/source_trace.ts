import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export interface SourceTrace {
  type: "source_trace"
  source_trace_id: string
  connected_source_port_ids: string[]
  connected_source_net_ids: string[]
  subcircuit_id?: string
  subcircuit_connectivity_map_key?: string
  max_length?: number
  /** Partner trace for a geometric coupling constraint. No name-based inference. */
  coupled_source_trace_id?: string
  /** Maximum centerline separation of parallel, overlapping same-layer segments, in mm. */
  max_coupling_distance?: number
  /** Maximum total uncoupled planar route length in mm. Requires both coupling fields.
   * Configure each member separately to constrain both sides of a pair.
   * Via barrel depth is excluded; through-pad travel is always uncoupled.
   */
  max_uncoupled_length?: number
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
  coupled_source_trace_id: z.string().min(1).optional(),
  max_coupling_distance: z.number().nonnegative().finite().optional(),
  max_uncoupled_length: z.number().nonnegative().finite().optional(),
  max_via_count: z.number().int().nonnegative().optional(),
  name: z.string().optional(),
  min_trace_thickness: z.number().optional(),
  display_name: z.string().optional(),
})

type InferredSourceTrace = z.infer<typeof source_trace>

expectTypesMatch<SourceTrace, InferredSourceTrace>(true)
