import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"

/** Rule-specific routing measurements. Lengths and centreline spacing are mm; impedance is ohms. */
export type PcbBusRoutingConstraintViolation =
  | {
      routing_rule: "length_skew"
      actual_length_skew: number
      maximum_length_skew: number
    }
  | {
      routing_rule: "min_length"
      actual_trace_length: number
      minimum_trace_length: number
    }
  | {
      routing_rule: "max_length"
      actual_trace_length: number
      maximum_trace_length: number
    }
  | {
      routing_rule: "target_length"
      actual_trace_length: number
      target_trace_length: number
      length_tolerance: number
    }
  | {
      routing_rule: "pcb_trace_spacing"
      other_pcb_trace_id: string
      other_source_trace_id?: string
      actual_centerline_spacing: number
      minimum_centerline_spacing: number
    }
  | {
      routing_rule: "pcb_spacing_to_other_signals"
      other_pcb_trace_id: string
      other_source_trace_id?: string
      actual_centerline_spacing: number
      minimum_centerline_spacing: number
    }
  | {
      routing_rule: "impedance_target"
      target_impedance: number
      minimum_impedance?: number
      maximum_impedance?: number
    }

interface PcbBusRoutingConstraintErrorBase extends BaseCircuitJsonError {
  type: "pcb_bus_routing_constraint_error"
  pcb_bus_routing_constraint_error_id: string
  error_type: "pcb_bus_routing_constraint_error"
  source_bus_id: string
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  subcircuit_id?: string
}

/** A declared bus or differential-pair routing constraint is violated. */
type WithErrorContext<Violation> = Violation extends unknown
  ? {
      [Key in keyof (PcbBusRoutingConstraintErrorBase &
        Violation)]: (PcbBusRoutingConstraintErrorBase & Violation)[Key]
    }
  : never
export type PcbBusRoutingConstraintError =
  WithErrorContext<PcbBusRoutingConstraintViolation>

const error_base = base_circuit_json_error.extend({
  type: z.literal("pcb_bus_routing_constraint_error"),
  pcb_bus_routing_constraint_error_id: getZodPrefixedIdWithDefault(
    "pcb_bus_routing_constraint_error",
  ),
  error_type: z
    .literal("pcb_bus_routing_constraint_error")
    .default("pcb_bus_routing_constraint_error"),
  source_bus_id: z.string(),
  source_trace_ids: z.array(z.string()).min(1),
  pcb_trace_ids: z.array(z.string()),
  subcircuit_id: z.string().optional(),
})

export const pcb_bus_routing_constraint_error = z
  .discriminatedUnion("routing_rule", [
    error_base.extend({
      routing_rule: z.literal("length_skew"),
      actual_length_skew: z.number().nonnegative().finite(),
      maximum_length_skew: z.number().nonnegative().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("min_length"),
      actual_trace_length: z.number().nonnegative().finite(),
      minimum_trace_length: z.number().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("max_length"),
      actual_trace_length: z.number().nonnegative().finite(),
      maximum_trace_length: z.number().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("target_length"),
      actual_trace_length: z.number().nonnegative().finite(),
      target_trace_length: z.number().finite(),
      length_tolerance: z.number().nonnegative().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("pcb_trace_spacing"),
      other_pcb_trace_id: z.string(),
      other_source_trace_id: z.string().optional(),
      actual_centerline_spacing: z.number().nonnegative().finite(),
      minimum_centerline_spacing: z.number().positive().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("pcb_spacing_to_other_signals"),
      other_pcb_trace_id: z.string(),
      other_source_trace_id: z.string().optional(),
      actual_centerline_spacing: z.number().nonnegative().finite(),
      minimum_centerline_spacing: z.number().positive().finite(),
    }),
    error_base.extend({
      routing_rule: z.literal("impedance_target"),
      target_impedance: z.number().positive().finite(),
      minimum_impedance: z.number().positive().finite().optional(),
      maximum_impedance: z.number().positive().finite().optional(),
    }),
  ])
  .superRefine((error, ctx) => {
    if (error.routing_rule !== "impedance_target") return
    if (
      error.minimum_impedance === undefined &&
      error.maximum_impedance === undefined
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minimum_impedance"],
        message: "Provide an impedance bound",
      })
    if (
      error.minimum_impedance !== undefined &&
      error.maximum_impedance !== undefined &&
      error.minimum_impedance > error.maximum_impedance
    )
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maximum_impedance"],
        message: "Impedance bounds must be ordered",
      })
  })
  .describe(
    "A declared bus or differential-pair routing constraint is violated.",
  )

export type PcbBusRoutingConstraintErrorInput = z.input<
  typeof pcb_bus_routing_constraint_error
>
expectTypesMatch<
  PcbBusRoutingConstraintError,
  z.infer<typeof pcb_bus_routing_constraint_error>
>(true)
