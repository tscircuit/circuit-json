import { z } from "zod"
import {
  base_circuit_json_error,
  type BaseCircuitJsonError,
} from "src/base_circuit_json_error"
import { getZodPrefixedIdWithDefault } from "src/common"
import {
  differential_pair_lane_lengths,
  type DifferentialPairLaneLengths,
} from "src/common/DifferentialPairLaneLengths"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** The routed lengths of a bus's members exceed its allowed skew. */
export interface PcbBusLengthSkewError extends BaseCircuitJsonError {
  type: "pcb_bus_length_skew_error"
  pcb_bus_length_skew_error_id: string
  error_type: "pcb_bus_length_skew_error"
  source_bus_id: string
  source_trace_ids: string[]
  pcb_trace_ids: string[]
  actual_length_skew: number
  maximum_length_skew: number
  subcircuit_id?: string
  /** Required for pair diagnostics; absent for ordinary bus diagnostics. */
  differential_pair_lengths?: DifferentialPairLaneLengths
}

export const pcb_bus_length_skew_error = base_circuit_json_error
  .extend({
    type: z.literal("pcb_bus_length_skew_error"),
    pcb_bus_length_skew_error_id: getZodPrefixedIdWithDefault(
      "pcb_bus_length_skew_error",
    ),
    error_type: z
      .literal("pcb_bus_length_skew_error")
      .default("pcb_bus_length_skew_error"),
    source_bus_id: z.string(),
    source_trace_ids: z.array(z.string()),
    pcb_trace_ids: z.array(z.string()),
    actual_length_skew: z.number().nonnegative().finite(),
    maximum_length_skew: z.number().nonnegative().finite(),
    subcircuit_id: z.string().optional(),
    differential_pair_lengths: differential_pair_lane_lengths.optional(),
  })
  .superRefine((error, ctx) => {
    const lengths = error.differential_pair_lengths
    if (
      lengths &&
      Math.abs(
        error.actual_length_skew -
          Math.abs(lengths.positive_length - lengths.negative_length),
      ) > 1e-9
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["actual_length_skew"],
        message:
          "actual_length_skew must equal the absolute difference between the lane lengths",
      })
    }
  })

export type PcbBusLengthSkewErrorInput = z.input<
  typeof pcb_bus_length_skew_error
>
expectTypesMatch<
  PcbBusLengthSkewError,
  z.infer<typeof pcb_bus_length_skew_error>
>(true)
