import { z } from "zod"
import { point, type Point, getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_trace_warning = z
  .object({
    type: z.literal("pcb_trace_warning"),
    pcb_trace_warning_id: getZodPrefixedIdWithDefault("pcb_trace_warning"),
    warning_type: z.literal("pcb_trace_warning").default("pcb_trace_warning"),
    message: z.string(),
    center: point.optional(),
    pcb_trace_id: z.string().optional(),
    source_trace_id: z.string(),
    pcb_component_ids: z.array(z.string()),
    pcb_port_ids: z.array(z.string()),
    source_bus_id: z.string().optional(),
    routing_rule: z.string().optional(),
    actual_value: z.number().finite().optional(),
    expected_min: z.number().finite().optional(),
    expected_max: z.number().finite().optional(),
    units: z.enum(["mm", "ohm", "count"]).optional(),
    subcircuit_id: z.string().optional(),
  })
  .describe("Defines a trace warning on the PCB")

export type PcbTraceWarningInput = z.input<typeof pcb_trace_warning>
type InferredPcbTraceWarning = z.infer<typeof pcb_trace_warning>

/**
 * Defines a trace warning on the PCB
 */
export interface PcbTraceWarning {
  type: "pcb_trace_warning"
  pcb_trace_warning_id: string
  warning_type: "pcb_trace_warning"
  message: string
  center?: Point
  /** May be absent when the source trace has no routed geometry to verify. */
  pcb_trace_id?: string
  source_trace_id: string
  pcb_component_ids: string[]
  pcb_port_ids: string[]
  /** Optional routing-rule context; references are not user-facing labels. */
  source_bus_id?: string
  routing_rule?: string
  actual_value?: number
  expected_min?: number
  expected_max?: number
  units?: "mm" | "ohm" | "count"
  subcircuit_id?: string
}

expectTypesMatch<PcbTraceWarning, InferredPcbTraceWarning>(true)
