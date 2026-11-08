import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Signed crosstalk peaks relative to the undisturbed idle voltage at one quiet endpoint. */
export interface SimulationSignalCrosstalk {
  type: "simulation_signal_crosstalk"
  simulation_signal_crosstalk_id: string
  simulation_signal_id: string
  end: "near" | "far"
  source_port_id: string
  idle_voltage_v: number
  peak_positive_v: number
  peak_negative_v: number
}

export const simulation_signal_crosstalk = z
  .object({
    type: z.literal("simulation_signal_crosstalk"),
    simulation_signal_crosstalk_id: getZodPrefixedIdWithDefault(
      "simulation_signal_crosstalk",
    ),
    simulation_signal_id: z.string().min(1),
    end: z.enum(["near", "far"]),
    source_port_id: z.string().min(1),
    idle_voltage_v: z.number().finite(),
    peak_positive_v: z.number().finite().nonnegative(),
    peak_negative_v: z.number().finite().nonpositive(),
  })
  .describe(
    "Stores signed NEXT or FEXT peaks from a quiet endpoint's idle level",
  )

export type SimulationSignalCrosstalkInput = z.input<
  typeof simulation_signal_crosstalk
>
expectTypesMatch<
  SimulationSignalCrosstalk,
  z.infer<typeof simulation_signal_crosstalk>
>(true)
