import { z } from "zod"
import { getZodPrefixedIdWithDefault } from "src/common"
import { ms } from "src/units"
import { expectTypesMatch } from "src/utils/expect-types-match"

/** An eye measurement of driven channels in a transient channel simulation. */
export interface SimulationEyeDiagram {
  type: "simulation_eye_diagram"
  simulation_eye_diagram_id: string
  name: string
  simulation_pcb_transient_channel_simulation_id: string
  /** Omitted: every driven channel. Constant patterns and disabled drivers are skipped. */
  simulation_pcb_driver_receiver_channel_ids?: string[]
  /** Omitted: skip startup settling. */
  start_time_ms?: number
  /** Omitted: end of simulation. */
  end_time_ms?: number
}

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
    start_time_ms: ms.refine((value) => value >= 0).optional(),
    end_time_ms: ms.refine((value) => value > 0).optional(),
  })
  .strict()
  .refine(
    (eye) =>
      eye.start_time_ms === undefined ||
      eye.end_time_ms === undefined ||
      eye.end_time_ms > eye.start_time_ms,
    { path: ["end_time_ms"], message: "Eye window end must follow its start" },
  )
  .describe("Selects driven channels and an optional eye measurement window")

export type SimulationEyeDiagramInput = z.input<typeof simulation_eye_diagram>
expectTypesMatch<SimulationEyeDiagram, z.infer<typeof simulation_eye_diagram>>(
  true,
)
