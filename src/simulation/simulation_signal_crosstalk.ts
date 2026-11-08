import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Peak near-end and far-end crosstalk magnitudes in volts for one quiet receiver. */
export interface SimulationSignalCrosstalk {
  type: "simulation_signal_crosstalk"
  simulation_signal_crosstalk_id: string
  simulation_signal_id: string
  source_port_id: string
  peak_next_v: number
  peak_fext_v: number
}

export const simulation_signal_crosstalk = z
  .object({
    type: z.literal("simulation_signal_crosstalk"),
    simulation_signal_crosstalk_id: getZodPrefixedIdWithDefault(
      "simulation_signal_crosstalk",
    ),
    simulation_signal_id: z.string().min(1),
    source_port_id: z.string().min(1),
    peak_next_v: z.number().finite().nonnegative(),
    peak_fext_v: z.number().finite().nonnegative(),
  })
  .describe("Stores peak NEXT and FEXT magnitudes in volts for a quiet signal")

export type SimulationSignalCrosstalkInput = z.input<
  typeof simulation_signal_crosstalk
>
expectTypesMatch<
  SimulationSignalCrosstalk,
  z.infer<typeof simulation_signal_crosstalk>
>(true)
