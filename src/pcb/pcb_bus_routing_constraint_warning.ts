import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A declared bus or pair constraint could not be verified; this is not a pass. */
interface PcbBusRoutingConstraintWarningBase {
  type: "pcb_bus_routing_constraint_warning"
  pcb_bus_routing_constraint_warning_id: string
  warning_type: "pcb_bus_routing_constraint_warning"
  source_bus_id: string
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  message: string
  subcircuit_id?: string
}

const warning_base = z
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
    message: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "A declared bus or pair constraint could not be verified; this is not a pass.",
  )

type WarningRule =
  | "route_geometry"
  | "reference_geometry"
  | "spacing_geometry"
  | "target_length"
  | "physical_impedance"
type WithWarningContext<Rule> = Rule extends WarningRule
  ? {
      [Key in keyof (PcbBusRoutingConstraintWarningBase & {
        routing_rule: Rule
      })]: (PcbBusRoutingConstraintWarningBase & { routing_rule: Rule })[Key]
    }
  : never
export type PcbBusRoutingConstraintWarning = WithWarningContext<WarningRule>

export const pcb_bus_routing_constraint_warning = z.discriminatedUnion(
  "routing_rule",
  [
    warning_base.extend({ routing_rule: z.literal("route_geometry") }),
    warning_base.extend({ routing_rule: z.literal("reference_geometry") }),
    warning_base.extend({ routing_rule: z.literal("spacing_geometry") }),
    warning_base.extend({ routing_rule: z.literal("target_length") }),
    warning_base.extend({ routing_rule: z.literal("physical_impedance") }),
  ],
)

export type PcbBusRoutingConstraintWarningInput = z.input<
  typeof pcb_bus_routing_constraint_warning
>
expectTypesMatch<
  PcbBusRoutingConstraintWarning,
  z.infer<typeof pcb_bus_routing_constraint_warning>
>(true)
