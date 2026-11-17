import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** Parallel time (milliseconds) and voltage (volts) samples, including differential P - N. */
export interface SimulationSignalWaveformResult {
  type: "simulation_signal_waveform_result"
  simulation_signal_waveform_result_id: string
  simulation_pcb_driver_receiver_channel_id: string
  /** Driver port identifies the near end; receiver port identifies the far end. */
  source_port_id: string
  timestamps_ms: number[]
  voltage_levels: number[]
  /** Required for constant literal patterns or disabled drivers; omitted otherwise. Requires the referenced signal to validate. */
  idle_voltage_v?: number
}

const samples = z.object({
  timestamps_ms: z.array(z.number().finite().nonnegative()).min(1),
  voltage_levels: z.array(z.number().finite()).min(1),
})

function validateSamples(
  data: z.infer<typeof samples>,
  context: z.RefinementCtx,
) {
  if (data.timestamps_ms.length !== data.voltage_levels.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["voltage_levels"],
      message: "Each timestamp must have a voltage sample",
    })
  }
  if (
    data.timestamps_ms.some(
      (time, index, times) => index > 0 && time <= times[index - 1]!,
    )
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["timestamps_ms"],
      message: "Sample timestamps must be strictly increasing",
    })
  }
}

export const simulation_signal_waveform_result = samples
  .extend({
    type: z.literal("simulation_signal_waveform_result"),
    simulation_signal_waveform_result_id: getZodPrefixedIdWithDefault(
      "simulation_signal_waveform_result",
    ),
    simulation_pcb_driver_receiver_channel_id: z.string().min(1),
    idle_voltage_v: z.number().finite().optional(),
    source_port_id: z.string().min(1),
  })
  .refine((waveform) => waveform.timestamps_ms[0] === 0, {
    path: ["timestamps_ms", 0],
    message: "Sample timestamps must start at zero",
  })
  .superRefine(validateSamples)
  .describe(
    "Stores near-end or far-end signal voltage samples in milliseconds and volts",
  )

export type SimulationSignalWaveformResultInput = z.input<
  typeof simulation_signal_waveform_result
>
expectTypesMatch<
  SimulationSignalWaveformResult,
  z.infer<typeof simulation_signal_waveform_result>
>(true)
