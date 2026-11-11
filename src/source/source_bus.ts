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

/** A bus that is not a differential pair: resolved source traces with a maximum routed-length difference. */
export interface OrdinarySourceBus {
  type: "source_bus"
  source_bus_id: string
  name?: string
  source_trace_ids: string[]
  /** Maximum difference between the longest and shortest member, in millimeters. */
  max_length_skew?: number
  /** Intended single-ended characteristic impedance, in ohms. */
  target_impedance?: number
  /** Only set on SourceDifferentialPairBus. */
  differential_pair?: never
  /** Additional traces for length comparison, without changing electrical membership. */
  length_match_source_trace_ids?: string[]
  min_length?: SourceBusRouteLength
  max_length?: SourceBusRouteLength
  target_length?: SourceBusRouteLength
  length_tolerance?: number
  /** Spacing between traces within this bus. */
  pcb_trace_spacing?: SourceBusTraceSpacing
  /** Spacing to all signals outside this bus. */
  pcb_spacing_to_other_signals?: SourceBusTraceSpacing
  target_impedance_min?: number
  target_impedance_max?: number
  subcircuit_id?: string
}

const ordinary_source_bus = z.object({
  type: z.literal("source_bus"),
  source_bus_id: z.string(),
  name: z.string().optional(),
  source_trace_ids: z.array(z.string()).min(1),
  max_length_skew: z.number().nonnegative().finite().optional(),
  target_impedance: z.number().positive().finite().optional(),
  differential_pair: z.never().optional(),
  length_match_source_trace_ids: z.array(z.string()).min(1).optional(),
  min_length: route_length.optional(),
  max_length: route_length.optional(),
  target_length: route_length.optional(),
  length_tolerance: z.number().nonnegative().finite().optional(),
  pcb_trace_spacing: trace_spacing.optional(),
  pcb_spacing_to_other_signals: trace_spacing.optional(),
  target_impedance_min: z.number().positive().finite().optional(),
  target_impedance_max: z.number().positive().finite().optional(),
  subcircuit_id: z.string().optional(),
})

/** A differential pair: two lanes of source traces whose total lengths must match. */
export interface SourceDifferentialPairBus {
  type: "source_bus"
  source_bus_id: string
  name?: string
  subcircuit_id?: string
  /** Positive lane IDs followed by negative lane IDs. */
  source_trace_ids: [string, ...string[]]
  /** Maximum difference between the summed positive and negative lane lengths, in mm. */
  max_length_skew: number
  differential_pair: {
    positive_source_trace_ids: [string, ...string[]]
    negative_source_trace_ids: [string, ...string[]]
  }
}

const trace_ids = z.array(z.string()).nonempty()

export const source_differential_pair_bus = z
  .object({
    type: z.literal("source_bus"),
    source_bus_id: z.string(),
    name: z.string().optional(),
    subcircuit_id: z.string().optional(),
    source_trace_ids: trace_ids,
    max_length_skew: z.number().nonnegative().finite(),
    differential_pair: z.object({
      positive_source_trace_ids: trace_ids,
      negative_source_trace_ids: trace_ids,
    }),
  })
  .strict()
  .refine(
    ({ source_trace_ids, differential_pair }) => {
      const lane_ids = [
        ...differential_pair.positive_source_trace_ids,
        ...differential_pair.negative_source_trace_ids,
      ]
      return (
        lane_ids.length === source_trace_ids.length &&
        lane_ids.every((id, i) => id === source_trace_ids[i])
      )
    },
    {
      path: ["source_trace_ids"],
      message:
        "source_trace_ids must list the positive lane IDs, then the negative lane IDs",
    },
  )

/** A group of source traces routed together: an ordinary bus or a differential pair. */
export type SourceBus = OrdinarySourceBus | SourceDifferentialPairBus

export const source_bus = z.union([
  ordinary_source_bus,
  source_differential_pair_bus,
])

export type SourceBusInput = z.input<typeof source_bus>
expectTypesMatch<OrdinarySourceBus, z.infer<typeof ordinary_source_bus>>(true)
expectTypesMatch<
  SourceDifferentialPairBus,
  z.infer<typeof source_differential_pair_bus>
>(true)
expectTypesMatch<SourceBus, z.infer<typeof source_bus>>(true)
