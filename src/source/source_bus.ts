import { z } from "zod"
import {
  routing_constraints,
  type RoutingConstraints,
} from "./routing_constraints"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A group of resolved source traces with a maximum routed-length difference. */
export interface SourceBus {
  type: "source_bus"
  source_bus_id: string
  name?: string
  source_trace_ids: string[]
  /** Maximum difference between the longest and shortest member, in millimeters. */
  max_length_skew?: number
  /** Intended single-ended characteristic impedance, in ohms. */
  target_impedance?: number
  /** Intended differential characteristic impedance, in ohms. */
  target_differential_impedance?: number
  /** Ordered polarity for a resolved point-to-point differential pair. */
  differential_pair?: {
    positive_source_trace_id: string
    negative_source_trace_id: string
    trace_gap?: number
    max_uncoupled_length?: number
  }
  routing_constraints?: RoutingConstraints
  subcircuit_id?: string
}

export const source_bus = z.object({
  type: z.literal("source_bus"),
  source_bus_id: z.string(),
  name: z.string().optional(),
  source_trace_ids: z.array(z.string()).min(1),
  max_length_skew: z.number().nonnegative().finite().optional(),
  target_impedance: z.number().positive().finite().optional(),
  target_differential_impedance: z.number().positive().finite().optional(),
  differential_pair: z
    .object({
      positive_source_trace_id: z.string(),
      negative_source_trace_id: z.string(),
      trace_gap: z.number().positive().finite().optional(),
      max_uncoupled_length: z.number().nonnegative().finite().optional(),
    })
    .optional(),
  routing_constraints: routing_constraints.optional(),
  subcircuit_id: z.string().optional(),
})

export type SourceBusInput = z.input<typeof source_bus>
expectTypesMatch<SourceBus, z.infer<typeof source_bus>>(true)
