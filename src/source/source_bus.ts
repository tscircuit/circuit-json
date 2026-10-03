import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A routed length in mm, or an offset from the longest endpoint Manhattan distance.
 * Explicit references are resolved source traces; omitted references use the bus
 * members and length_match_source_trace_ids. */
export type SourceBusRouteLength =
  | number
  | {
      reference: "longest_manhattan"
      source_trace_ids?: string[]
      offset?: number
    }

/** Centerline separation in mm or a multiple of the larger local trace width. */
export type SourceBusTraceSpacing = number | { width_multiplier: number }

const route_length = z.union([
  z.number().nonnegative().finite(),
  z.object({
    reference: z.literal("longest_manhattan"),
    source_trace_ids: z.array(z.string()).min(1).optional(),
    offset: z.number().finite().optional(),
  }),
])
const trace_spacing = z.union([
  z.number().positive().finite(),
  z.object({ width_multiplier: z.number().positive().finite() }),
])

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
  /** Additional traces for length comparison, without changing electrical membership. */
  length_match_source_trace_ids?: string[]
  min_length?: SourceBusRouteLength
  max_length?: SourceBusRouteLength
  target_length?: SourceBusRouteLength
  length_tolerance?: number
  /** Within this bus, excluding declared differential partners. */
  pcb_trace_spacing?: SourceBusTraceSpacing
  /** To all signals outside this bus or pair. */
  pcb_spacing_to_other_signals?: SourceBusTraceSpacing
  target_impedance_min?: number
  target_impedance_max?: number
  target_differential_impedance_min?: number
  target_differential_impedance_max?: number
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
  length_match_source_trace_ids: z.array(z.string()).min(1).optional(),
  min_length: route_length.optional(),
  max_length: route_length.optional(),
  target_length: route_length.optional(),
  length_tolerance: z.number().nonnegative().finite().optional(),
  pcb_trace_spacing: trace_spacing.optional(),
  pcb_spacing_to_other_signals: trace_spacing.optional(),
  target_impedance_min: z.number().positive().finite().optional(),
  target_impedance_max: z.number().positive().finite().optional(),
  target_differential_impedance_min: z.number().positive().finite().optional(),
  target_differential_impedance_max: z.number().positive().finite().optional(),
  subcircuit_id: z.string().optional(),
})

export type SourceBusInput = z.input<typeof source_bus>
expectTypesMatch<SourceBus, z.infer<typeof source_bus>>(true)
