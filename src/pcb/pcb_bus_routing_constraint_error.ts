import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"

/** A declared bus or differential-pair routing constraint is violated. */
export interface PcbBusRoutingConstraintError extends BaseCircuitJsonError {
  type: "pcb_bus_routing_constraint_error"
  pcb_bus_routing_constraint_error_id: string
  error_type: "pcb_bus_routing_constraint_error"
  source_bus_id: string
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  routing_rule:
    | "length_skew"
    | "min_length"
    | "max_length"
    | "target_length"
    | "pcb_trace_spacing"
    | "pcb_spacing_to_other_signals"
    | "impedance_target"
  /** Measurements in the units required by the rule; not inferred electrical behavior. */
  actual_value?: number
  expected_min?: number
  expected_max?: number
  units: "mm" | "ohm"
  subcircuit_id?: string
}

export const pcb_bus_routing_constraint_error = base_circuit_json_error
  .extend({
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
    routing_rule: z.enum([
      "length_skew",
      "min_length",
      "max_length",
      "target_length",
      "pcb_trace_spacing",
      "pcb_spacing_to_other_signals",
      "impedance_target",
    ]),
    actual_value: z.number().finite().optional(),
    expected_min: z.number().finite().optional(),
    expected_max: z.number().finite().optional(),
    units: z.enum(["mm", "ohm"]),
    subcircuit_id: z.string().optional(),
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
