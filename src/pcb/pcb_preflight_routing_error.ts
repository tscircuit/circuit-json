import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_preflight_routing_error = base_circuit_json_error.extend({
  type: z.literal("pcb_preflight_routing_error"),
  pcb_preflight_routing_error_id: getZodPrefixedIdWithDefault(
    "pcb_preflight_routing_error",
  ),
  error_type: z
    .literal("pcb_preflight_routing_error")
    .default("pcb_preflight_routing_error"),
  error_code: z.string(),
  subcircuit_id: z.string().optional(),
  pcb_group_id: z.string().optional(),
  routing_phase_index: z.number().int().optional(),
  phase_name: z.string().optional(),
  source_trace_ids: z.array(z.string()).optional(),
  pcb_component_ids: z.array(z.string()).optional(),
  pcb_port_ids: z.array(z.string()).optional(),
  related_error_ids: z.array(z.string()).optional(),
  measurements: z.record(z.number().finite()).optional(),
})

export type PcbPreflightRoutingErrorInput = z.input<
  typeof pcb_preflight_routing_error
>

export interface PcbPreflightRoutingError extends BaseCircuitJsonError {
  type: "pcb_preflight_routing_error"
  pcb_preflight_routing_error_id: string
  error_type: "pcb_preflight_routing_error"
  error_code: string
  subcircuit_id?: string
  pcb_group_id?: string
  routing_phase_index?: number
  phase_name?: string
  source_trace_ids?: string[]
  pcb_component_ids?: string[]
  pcb_port_ids?: string[]
  related_error_ids?: string[]
  measurements?: Record<string, number>
}

expectTypesMatch<
  PcbPreflightRoutingError,
  z.infer<typeof pcb_preflight_routing_error>
>(true)
