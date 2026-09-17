import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A group of resolved source traces with a maximum routed-length difference. */
export interface SourceBus {
  type: "source_bus"
  source_bus_id: string
  name?: string
  source_trace_ids: string[]
  /** Maximum difference between the longest and shortest member, in millimeters. */
  max_length_skew?: number
  subcircuit_id?: string
}

export const source_bus = z.object({
  type: z.literal("source_bus"),
  source_bus_id: z.string(),
  name: z.string().optional(),
  source_trace_ids: z.array(z.string()).min(1),
  max_length_skew: z.number().nonnegative().finite().optional(),
  subcircuit_id: z.string().optional(),
})

export type SourceBusInput = z.input<typeof source_bus>
expectTypesMatch<SourceBus, z.infer<typeof source_bus>>(true)
