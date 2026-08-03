import { z } from "zod"
import { current, ms, voltage } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

const timestamps_ms = z.array(
  ms.refine((timestampMs) => timestampMs >= 0, {
    message: "Waveform timestamps must be nonnegative",
  }),
)

const validateWaveform = (
  waveform: {
    timestamps_ms: number[]
    voltage_values?: number[]
    current_values?: number[]
  },
  context: z.RefinementCtx,
) => {
  const values = waveform.voltage_values ?? waveform.current_values ?? []
  if (waveform.timestamps_ms.length !== values.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Waveform timestamps and values must have the same length",
    })
  }

  for (let index = 1; index < waveform.timestamps_ms.length; index++) {
    if (waveform.timestamps_ms[index]! <= waveform.timestamps_ms[index - 1]!) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timestamps_ms", index],
        message: "Waveform timestamps must be strictly increasing",
      })
      break
    }
  }
}

export const simulation_voltage_waveform = z
  .object({
    timestamps_ms: timestamps_ms.min(1),
    voltage_values: z.array(voltage).min(1),
  })
  .superRefine(validateWaveform)

export interface SimulationVoltageWaveform {
  timestamps_ms: number[]
  voltage_values: number[]
}

expectTypesMatch<
  SimulationVoltageWaveform,
  z.infer<typeof simulation_voltage_waveform>
>(true)

export const simulation_current_waveform = z
  .object({
    timestamps_ms: timestamps_ms.min(1),
    current_values: z.array(current).min(1),
  })
  .superRefine(validateWaveform)

export interface SimulationCurrentWaveform {
  timestamps_ms: number[]
  current_values: number[]
}

expectTypesMatch<
  SimulationCurrentWaveform,
  z.infer<typeof simulation_current_waveform>
>(true)
