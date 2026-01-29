import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_pin_must_be_connected_error = base_circuit_json_error
  .extend({
    type: z.literal("source_pin_must_be_connected_error"),
    source_pin_must_be_connected_error_id: getZodPrefixedIdWithDefault(
      "source_pin_must_be_connected_error",
    ),
    error_type: z
      .literal("source_pin_must_be_connected_error")
      .default("source_pin_must_be_connected_error"),
    source_component_id: z.string(),
    source_port_id: z.string(),
    subcircuit_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a pin with mustBeConnected attribute is not connected to any trace",
  )

export type SourcePinMustBeConnectedErrorInput = z.input<
  typeof source_pin_must_be_connected_error
>
type InferredSourcePinMustBeConnectedError = z.infer<
  typeof source_pin_must_be_connected_error
>

/**
 * Error emitted when a pin with mustBeConnected attribute is not connected to any trace
 */
export interface SourcePinMustBeConnectedError extends BaseCircuitJsonError {
  type: "source_pin_must_be_connected_error"
  source_pin_must_be_connected_error_id: string
  error_type: "source_pin_must_be_connected_error"
  source_component_id: string
  source_port_id: string
  subcircuit_id?: string
}

expectTypesMatch<
  SourcePinMustBeConnectedError,
  InferredSourcePinMustBeConnectedError
>(true)
