import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const pcb_port_hint_ambiguous_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_port_hint_ambiguous_error"),
    pcb_port_hint_ambiguous_error_id: getZodPrefixedIdWithDefault(
      "pcb_port_hint_ambiguous_error",
    ),
    error_type: z
      .literal("pcb_port_hint_ambiguous_error")
      .default("pcb_port_hint_ambiguous_error"),
    source_port_id: z.string().optional(),
    pcb_component_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a port hint matches multiple non-overlapping pads, making the port ambiguous",
  )

export type PcbPortHintAmbiguousErrorInput = z.input<
  typeof pcb_port_hint_ambiguous_error
>
type InferredPcbPortHintAmbiguousError = z.infer<
  typeof pcb_port_hint_ambiguous_error
>

/**
 * Error emitted when a port hint matches multiple non-overlapping pads,
 * making the port ambiguous (e.g. multiple pads all named "SH").
 */
export interface PcbPortHintAmbiguousError extends BaseCircuitJsonError {
  type: "pcb_port_hint_ambiguous_error"
  pcb_port_hint_ambiguous_error_id: string
  error_type: "pcb_port_hint_ambiguous_error"
  source_port_id?: string
  pcb_component_id?: string
}

expectTypesMatch<PcbPortHintAmbiguousError, InferredPcbPortHintAmbiguousError>(
  true,
)
