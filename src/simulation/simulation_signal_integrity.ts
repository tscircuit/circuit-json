import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** One independent signal integrity test over the board's coupled copper. */
export interface SimulationSignalIntegrity {
  type: "simulation_signal_integrity"
  simulation_signal_integrity_id: string
  name?: string
  bit_rate_bps: number
  duration_s?: number
  allow_unrouted_traces: boolean
}

export const simulation_signal_integrity = z
  .object({
    type: z.literal("simulation_signal_integrity"),
    simulation_signal_integrity_id: getZodPrefixedIdWithDefault(
      "simulation_signal_integrity",
    ),
    name: z.string().min(1).optional(),
    bit_rate_bps: z.number().finite().positive(),
    duration_s: z.number().finite().positive().optional(),
    allow_unrouted_traces: z.boolean(),
  })
  .describe("Defines an independent coupled signal integrity simulation")

export type SimulationSignalIntegrityInput = z.input<
  typeof simulation_signal_integrity
>
expectTypesMatch<
  SimulationSignalIntegrity,
  z.infer<typeof simulation_signal_integrity>
>(true)
