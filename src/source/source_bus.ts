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
export interface OrdinarySourceBus {
  type: "source_bus"
  source_bus_id: string
  name?: string
  source_trace_ids: string[]
  /** Maximum difference between the longest and shortest member, in millimeters. */
  max_length_skew?: number
  /** Intended single-ended characteristic impedance, in ohms. */
  target_impedance?: number
  differential_pair?: never
  /** Additional traces for length comparison, without changing electrical membership. */
  length_match_source_trace_ids?: string[]
  min_length?: SourceBusRouteLength
  max_length?: SourceBusRouteLength
  target_length?: SourceBusRouteLength
  length_tolerance?: number
  /** Within this bus. */
  pcb_trace_spacing?: SourceBusTraceSpacing
  /** To all signals outside this bus. */
  pcb_spacing_to_other_signals?: SourceBusTraceSpacing
  target_impedance_min?: number
  target_impedance_max?: number
  subcircuit_id?: string
}

const ordinary_source_bus = z
  .object({
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
  .strict()

/** Ordered owned hops; skew compares the two lane sums of planar copper in mm. */
export type SourceDifferentialPairBus = {
  type: "source_bus"
  source_bus_id: string
  name?: string
  subcircuit_id?: string
  /** Exactly the positive IDs followed by the negative IDs, without duplicates. */
  source_trace_ids: [string, ...string[]]
  /** Required finite, nonnegative maximum difference between the lane sums. */
  max_length_skew: number
  differential_pair: {
    positive_source_trace_ids: [string, ...string[]]
    negative_source_trace_ids: [string, ...string[]]
  }
} & {
  [K in Exclude<
    keyof OrdinarySourceBus,
    | "type"
    | "source_bus_id"
    | "name"
    | "subcircuit_id"
    | "source_trace_ids"
    | "max_length_skew"
    | "differential_pair"
  >]?: never
}

const nonempty_trace_ids = z
  .array(z.string().regex(/\S/, "Trace IDs must not be empty"))
  .nonempty()

export const source_differential_pair_bus: z.ZodType<SourceDifferentialPairBus> =
  ordinary_source_bus
    .pick({
      type: true,
      source_bus_id: true,
      name: true,
      subcircuit_id: true,
    })
    .extend({
      source_trace_ids: nonempty_trace_ids,
      max_length_skew: z.number().nonnegative().finite(),
      differential_pair: z
        .object({
          positive_source_trace_ids: nonempty_trace_ids,
          negative_source_trace_ids: nonempty_trace_ids,
        })
        .strict(),
    })
    .strict()
    .superRefine((bus, ctx) => {
      const ids = [
        ...bus.differential_pair.positive_source_trace_ids,
        ...bus.differential_pair.negative_source_trace_ids,
      ]
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["differential_pair"],
          message:
            "Each source trace must occur exactly once across both lanes",
        })
      }
      if (
        ids.length !== bus.source_trace_ids.length ||
        ids.some((id, index) => id !== bus.source_trace_ids[index])
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["source_trace_ids"],
          message:
            "source_trace_ids must equal positive_source_trace_ids followed by negative_source_trace_ids",
        })
      }
    })

/** Ordinary bus skew compares members; differential pair skew compares lane sums. */
export type SourceBus = OrdinarySourceBus | SourceDifferentialPairBus

export const source_bus = z.union([
  ordinary_source_bus,
  source_differential_pair_bus,
])

export type SourceBusInput = z.input<typeof source_bus>
expectTypesMatch<OrdinarySourceBus, z.infer<typeof ordinary_source_bus>>(true)
expectTypesMatch<SourceBus, z.infer<typeof source_bus>>(true)
