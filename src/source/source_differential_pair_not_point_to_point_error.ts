import {
  type BaseCircuitJsonError,
  base_circuit_json_error,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { z } from "zod"

export const source_differential_pair_not_point_to_point_error =
  base_circuit_json_error
    .extend({
      type: z.literal("source_differential_pair_not_point_to_point_error"),
      source_differential_pair_not_point_to_point_error_id:
        getZodPrefixedIdWithDefault(
          "source_differential_pair_not_point_to_point_error",
        ),
      error_type: z
        .literal("source_differential_pair_not_point_to_point_error")
        .default("source_differential_pair_not_point_to_point_error"),
      subcircuit_id: z.string().optional(),
      differential_pair_name: z.string().optional(),
      connection_polarity: z.enum(["positive", "negative"]),
      connection_selector: z.string(),
      subcircuit_connectivity_map_key: z.string().optional(),
      source_net_id: z.string().optional(),
      connected_source_port_ids: z.array(z.string()),
    })
    .describe(
      "Error emitted when one side of a differential pair does not connect exactly two source ports",
    )

export type SourceDifferentialPairNotPointToPointErrorInput = z.input<
  typeof source_differential_pair_not_point_to_point_error
>
type InferredSourceDifferentialPairNotPointToPointError = z.infer<
  typeof source_differential_pair_not_point_to_point_error
>

/**
 * Error emitted when one side of a differential pair does not connect exactly
 * two source ports.
 */
export interface SourceDifferentialPairNotPointToPointError
  extends BaseCircuitJsonError {
  type: "source_differential_pair_not_point_to_point_error"
  source_differential_pair_not_point_to_point_error_id: string
  error_type: "source_differential_pair_not_point_to_point_error"
  subcircuit_id?: string
  differential_pair_name?: string
  connection_polarity: "positive" | "negative"
  connection_selector: string
  subcircuit_connectivity_map_key?: string
  source_net_id?: string
  connected_source_port_ids: string[]
}

expectTypesMatch<
  SourceDifferentialPairNotPointToPointError,
  InferredSourceDifferentialPairNotPointToPointError
>(true)
