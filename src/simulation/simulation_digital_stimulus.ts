import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { ms } from "src/units"

export const simulation_digital_stimulus = z
  .object({
    type: z.literal("simulation_digital_stimulus"),
    simulation_digital_stimulus_id: getZodPrefixedIdWithDefault(
      "simulation_digital_stimulus",
    ),
    name: z.string().min(1),
    simulation_experiment_id: z.string().min(1),
    source_port_id: z.string().min(1),
    unit_interval_ms: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds > 0,
    ),
    start_time_ms: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds >= 0,
    ),
    initial_state: z.union([z.literal(0), z.literal(1)]),
    inverted: z.boolean(),
    pattern: z
      .object({
        type: z.literal("bits"),
        bits: z.string().regex(/^[01]+$/),
        repeat: z.boolean(),
      })
      .strict(),
  })
  .describe(
    "Declares deterministic drive bits and timing in milliseconds for a physical source port",
  )

export type SimulationDigitalStimulus = z.infer<
  typeof simulation_digital_stimulus
>
export type SimulationDigitalStimulusInput = z.input<
  typeof simulation_digital_stimulus
>
