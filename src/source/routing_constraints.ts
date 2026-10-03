import { z } from "zod"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Reusable constraints for a resolved bus. Distances are mm, impedances ohms.
 * Names refer to buses in the same subcircuit. No protocol or vendor defaults. */
export interface RoutingConstraints {
  expected_trace_count?: number
  length_bounds?: {
    reference_bus?: string
    reference_metric?: "longest_manhattan"
    min?: number
    max?: number
  }
  spacing?: Array<{
    other_bus: string
    centerline_width_multiplier: number
    reduced_centerline_width_multiplier?: number
  }>
  max_reduced_spacing_length?: number
  impedance_bounds?: { min?: number; max?: number }
}
const bounds = z
  .object({
    min: z.number().nonnegative().finite().optional(),
    max: z.number().nonnegative().finite().optional(),
  })
  .refine(
    (b) =>
      (b.min !== undefined || b.max !== undefined) &&
      !(b.min !== undefined && b.max !== undefined && b.min > b.max),
    "Provide ordered min/max bounds",
  )
export const routing_constraints = z
  .object({
    expected_trace_count: z.number().int().positive().optional(),
    length_bounds: z
      .object({
        reference_bus: z.string().min(1).optional(),
        reference_metric: z.literal("longest_manhattan").optional(),
        min: z.number().finite().optional(),
        max: z.number().finite().optional(),
      })
      .refine(
        (b) =>
          Boolean(b.reference_bus) === Boolean(b.reference_metric) &&
          (b.min !== undefined || b.max !== undefined) &&
          !(b.min !== undefined && b.max !== undefined && b.min > b.max) &&
          (b.reference_bus !== undefined ||
            ((b.min ?? 0) >= 0 && (b.max ?? 0) >= 0)),
        "Provide ordered bounds and both reference fields for relative lengths",
      )
      .optional(),
    spacing: z
      .array(
        z
          .object({
            other_bus: z.string().min(1),
            centerline_width_multiplier: z.number().positive().finite(),
            reduced_centerline_width_multiplier: z
              .number()
              .positive()
              .finite()
              .optional(),
          })
          .refine(
            (s) =>
              (s.reduced_centerline_width_multiplier ??
                s.centerline_width_multiplier) <= s.centerline_width_multiplier,
            "Reduced spacing cannot exceed normal spacing",
          ),
      )
      .min(1)
      .optional(),
    max_reduced_spacing_length: z.number().nonnegative().finite().optional(),
    impedance_bounds: bounds.optional(),
  })
  .refine(
    (c) =>
      Boolean(
        c.spacing?.some(
          (s) => s.reduced_centerline_width_multiplier !== undefined,
        ),
      ) ===
      (c.max_reduced_spacing_length !== undefined),
    "Reduced spacing requires a shared length cap, and the cap requires reduced spacing",
  )
expectTypesMatch<RoutingConstraints, z.infer<typeof routing_constraints>>(true)
