import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** A failed DDR rule or a rule whose physical inputs cannot be verified.
 * Unverified results must never be interpreted as an electrical pass. */
export interface PcbDdrRoutingError extends BaseCircuitJsonError {
  type: "pcb_ddr_routing_error"
  pcb_ddr_routing_error_id: string
  error_type: "pcb_ddr_routing_error"
  status: "violation" | "unverified"
  rule: string
  specification: "SPRS717L"
  specification_section: string
  source_bus_ids: string[]
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  actual_value?: number
  expected_min?: number
  expected_max?: number
  units?: "mm" | "ohm" | "count"
  subcircuit_id?: string
}
export const pcb_ddr_routing_error = base_circuit_json_error.extend({
  type: z.literal("pcb_ddr_routing_error"),
  pcb_ddr_routing_error_id: getZodPrefixedIdWithDefault(
    "pcb_ddr_routing_error",
  ),
  error_type: z
    .literal("pcb_ddr_routing_error")
    .default("pcb_ddr_routing_error"),
  status: z.enum(["violation", "unverified"]),
  rule: z.string(),
  specification: z.literal("SPRS717L"),
  specification_section: z.string(),
  source_bus_ids: z.array(z.string()),
  source_trace_ids: z.array(z.string()),
  pcb_trace_ids: z.array(z.string()),
  actual_value: z.number().finite().optional(),
  expected_min: z.number().finite().optional(),
  expected_max: z.number().finite().optional(),
  units: z.enum(["mm", "ohm", "count"]).optional(),
  subcircuit_id: z.string().optional(),
})
export type PcbDdrRoutingErrorInput = z.input<typeof pcb_ddr_routing_error>
expectTypesMatch<PcbDdrRoutingError, z.infer<typeof pcb_ddr_routing_error>>(
  true,
)
