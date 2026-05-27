import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_component_misconfigured_error = base_circuit_json_error
  .extend({
    type: z.literal("source_component_misconfigured_error"),
    source_component_misconfigured_error_id: getZodPrefixedIdWithDefault(
      "source_component_misconfigured_error",
    ),
    error_type: z
      .literal("source_component_misconfigured_error")
      .default("source_component_misconfigured_error"),
    source_component_ids: z.array(z.string()),
    source_port_ids: z.array(z.string()).optional(),
  })
  .describe(
    "Error emitted when one or more source components have an invalid or conflicting configuration",
  )

export type SourceComponentMisconfiguredErrorInput = z.input<
  typeof source_component_misconfigured_error
>
type InferredSourceComponentMisconfiguredError = z.infer<
  typeof source_component_misconfigured_error
>

/**
 * Error emitted when one or more source components have an invalid or conflicting configuration
 */
export interface SourceComponentMisconfiguredError
  extends BaseCircuitJsonError {
  type: "source_component_misconfigured_error"
  source_component_misconfigured_error_id: string
  error_type: "source_component_misconfigured_error"
  source_component_ids: string[]
  source_port_ids?: string[]
}

expectTypesMatch<
  SourceComponentMisconfiguredError,
  InferredSourceComponentMisconfiguredError
>(true)
