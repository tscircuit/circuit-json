import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** An eye measurement of driven channels in a transient channel simulation. */
export interface SimulationEyeDiagram {
  type: "simulation_eye_diagram"
  simulation_eye_diagram_id: string
  name: string
  simulation_pcb_transient_channel_simulation_id: string
  /** Omitted: every driven channel. Constant patterns and disabled drivers are skipped. */
  simulation_pcb_driver_receiver_channel_ids?: string[]
  /** Seconds, or a UI string resolved at each channel's bit rate. Omitted: skip startup settling. */
  start_time?: number | string
  /** Seconds, or a UI string resolved at each channel's bit rate. Omitted: end of simulation. */
  end_time?: number | string
}

const eye_time = z.union([
  z.number().finite().nonnegative(),
  z
    .string()
    .regex(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?UI$/)
    .refine((value) => Number.isFinite(Number.parseFloat(value))),
])

export const simulation_eye_diagram = z
  .object({
    type: z.literal("simulation_eye_diagram"),
    simulation_eye_diagram_id: getZodPrefixedIdWithDefault(
      "simulation_eye_diagram",
    ),
    name: z.string().trim().min(1),
    simulation_pcb_transient_channel_simulation_id: z.string().min(1),
    simulation_pcb_driver_receiver_channel_ids: z
      .array(z.string().min(1))
      .min(1)
      .optional(),
    start_time: eye_time.optional(),
    end_time: eye_time.optional(),
  })
  .strict()
  .superRefine((eye, context) => {
    // Mixed seconds/UI bounds and channel membership require the referenced records.
    if (
      eye.start_time !== undefined &&
      eye.end_time !== undefined &&
      typeof eye.start_time === typeof eye.end_time &&
      Number.parseFloat(String(eye.start_time)) >=
        Number.parseFloat(String(eye.end_time))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time"],
        message: "Eye window end must follow its start",
      })
    }
  })
  .describe("Selects driven channels and an optional eye measurement window")

export type SimulationEyeDiagramInput = z.input<typeof simulation_eye_diagram>
expectTypesMatch<SimulationEyeDiagram, z.infer<typeof simulation_eye_diagram>>(
  true,
)
