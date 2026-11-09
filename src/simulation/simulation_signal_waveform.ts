import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Parallel time (seconds) and voltage (volts) samples, including differential P - N. */
export interface SimulationSignalWaveform {
  type: "simulation_signal_waveform"
  simulation_signal_waveform_id: string
  simulation_signal_id: string
  end: "near" | "far"
  source_port_id: string
  timestamps_s: number[]
  voltage_levels: number[]
  idle_voltage_v?: number
}

const samples = z.object({
  timestamps_s: z.array(z.number().finite().nonnegative()).min(1),
  voltage_levels: z.array(z.number().finite()).min(1),
})

function validateSamples(
  data: z.infer<typeof samples>,
  context: z.RefinementCtx,
) {
  if (data.timestamps_s.length !== data.voltage_levels.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["voltage_levels"],
      message: "Each timestamp must have a voltage sample",
    })
  }
  if (
    data.timestamps_s.some(
      (time, index, times) => index > 0 && time <= times[index - 1]!,
    )
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["timestamps_s"],
      message: "Sample timestamps must be strictly increasing",
    })
  }
}

export const simulation_signal_waveform = samples
  .extend({
    type: z.literal("simulation_signal_waveform"),
    simulation_signal_waveform_id: getZodPrefixedIdWithDefault(
      "simulation_signal_waveform",
    ),
    simulation_signal_id: z.string().min(1),
    idle_voltage_v: z.number().finite().optional(),
    end: z.enum(["near", "far"]),
    source_port_id: z.string().min(1),
  })
  .superRefine(validateSamples)
  .describe(
    "Stores near-end or far-end signal voltage samples in seconds and volts",
  )

export type SimulationSignalWaveformInput = z.input<
  typeof simulation_signal_waveform
>
expectTypesMatch<
  SimulationSignalWaveform,
  z.infer<typeof simulation_signal_waveform>
>(true)
