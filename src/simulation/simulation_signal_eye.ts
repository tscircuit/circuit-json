import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"
import { simulation_signal_samples } from "./simulation_signal_waveform"

/** A receiver's folded eye traces and voltage/time opening; negative margin fails the mask. */
export interface SimulationSignalEye {
  type: "simulation_signal_eye"
  simulation_signal_eye_id: string
  simulation_signal_id: string
  source_port_id: string
  folded_traces: { timestamps_s: number[]; voltage_levels: number[] }[]
  eye_height_v: number
  eye_width_s: number
  mask_margin_v: number
}

export const simulation_signal_eye = z
  .object({
    type: z.literal("simulation_signal_eye"),
    simulation_signal_eye_id: getZodPrefixedIdWithDefault(
      "simulation_signal_eye",
    ),
    simulation_signal_id: z.string().min(1),
    source_port_id: z.string().min(1),
    folded_traces: z.array(simulation_signal_samples).min(1),
    eye_height_v: z.number().finite().nonnegative(),
    eye_width_s: z.number().finite().nonnegative(),
    mask_margin_v: z.number().finite(),
  })
  .describe(
    "Stores a receiver eye, folded on the bit interval or received strobe crossings",
  )

export type SimulationSignalEyeInput = z.input<typeof simulation_signal_eye>
expectTypesMatch<SimulationSignalEye, z.infer<typeof simulation_signal_eye>>(
  true,
)
