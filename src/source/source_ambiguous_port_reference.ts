import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

export const source_ambiguous_port_reference = base_circuit_json_error
  .extend({
    type: z.literal("source_ambiguous_port_reference"),
    source_ambiguous_port_reference_id: getZodPrefixedIdWithDefault(
      "source_ambiguous_port_reference",
    ),
    error_type: z
      .literal("source_ambiguous_port_reference")
      .default("source_ambiguous_port_reference"),
    source_port_id: z.string().optional(),
    source_component_id: z.string().optional(),
  })
  .describe(
    "Error emitted when a port hint matches multiple non-overlapping pads, making the port reference ambiguous",
  )

export type SourceAmbiguousPortReferenceInput = z.input<
  typeof source_ambiguous_port_reference
>
type InferredSourceAmbiguousPortReference = z.infer<
  typeof source_ambiguous_port_reference
>

/**
 * Error emitted when a port hint matches multiple non-overlapping pads,
 * making the port reference ambiguous (e.g. multiple pads all named "SH").
 */
export interface SourceAmbiguousPortReference extends BaseCircuitJsonError {
  type: "source_ambiguous_port_reference"
  source_ambiguous_port_reference_id: string
  error_type: "source_ambiguous_port_reference"
  source_port_id?: string
  source_component_id?: string
}

expectTypesMatch<
  SourceAmbiguousPortReference,
  InferredSourceAmbiguousPortReference
>(true)
