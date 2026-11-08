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
}

export const simulation_signal_samples = z
  .object({
    timestamps_s: z.array(z.number().finite().nonnegative()).min(1),
    voltage_levels: z.array(z.number().finite()).min(1),
  })
  .refine(
    (samples) => samples.timestamps_s.length === samples.voltage_levels.length,
    {
      path: ["voltage_levels"],
      message: "Each timestamp must have a voltage sample",
    },
  )

export const simulation_signal_waveform = z
  .object({
    type: z.literal("simulation_signal_waveform"),
    simulation_signal_waveform_id: getZodPrefixedIdWithDefault(
      "simulation_signal_waveform",
    ),
    simulation_signal_id: z.string().min(1),
    end: z.enum(["near", "far"]),
    source_port_id: z.string().min(1),
    timestamps_s: z.array(z.number().finite().nonnegative()).min(1),
    voltage_levels: z.array(z.number().finite()).min(1),
  })
  .refine(
    (samples) => samples.timestamps_s.length === samples.voltage_levels.length,
    {
      path: ["voltage_levels"],
      message: "Each timestamp must have a voltage sample",
    },
  )
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
