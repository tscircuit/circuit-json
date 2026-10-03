import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A declared bus or pair constraint could not be verified; this is not a pass. */
export interface PcbBusRoutingConstraintWarning {
  type: "pcb_bus_routing_constraint_warning"
  pcb_bus_routing_constraint_warning_id: string
  warning_type: "pcb_bus_routing_constraint_warning"
  source_bus_id: string
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  routing_rule:
    | "route_geometry"
    | "reference_geometry"
    | "spacing_geometry"
    | "target_length"
    | "physical_impedance"
  message: string
  subcircuit_id?: string
}

export const pcb_bus_routing_constraint_warning = z
  .object({
    type: z.literal("pcb_bus_routing_constraint_warning"),
    pcb_bus_routing_constraint_warning_id: getZodPrefixedIdWithDefault(
      "pcb_bus_routing_constraint_warning",
    ),
    warning_type: z
      .literal("pcb_bus_routing_constraint_warning")
      .default("pcb_bus_routing_constraint_warning"),
    source_bus_id: z.string(),
    source_trace_ids: z.array(z.string()).min(1),
    pcb_trace_ids: z.array(z.string()),
    routing_rule: z.enum([
      "route_geometry",
      "reference_geometry",
      "spacing_geometry",
      "target_length",
      "physical_impedance",
    ]),
    message: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "A declared bus or pair constraint could not be verified; this is not a pass.",
  )

export type PcbBusRoutingConstraintWarningInput = z.input<
  typeof pcb_bus_routing_constraint_warning
>
expectTypesMatch<
  PcbBusRoutingConstraintWarning,
  z.infer<typeof pcb_bus_routing_constraint_warning>
>(true)
